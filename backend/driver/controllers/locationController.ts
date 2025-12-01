import { Request, Response } from "express";
import { setDriverPosition, getDriverPosition, shouldNotify } from "../locationStore";
import { getDriverSchedulesByAccountId } from "../models/driverModel";
import { getRouteWithStops as getRouteStops } from "../../route/models/routeModel";
import { createNotification, sendNotificationToAccount } from "../../Notification/Models/notificationModel";

// helper: distance in meters between lat/lng
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// POST /driver/location
export const updateDriverLocation = (req: any, res: Response) => {
  try {
    const { driverId: bodyDriverId, latitude: rawLat, longitude: rawLng } = req.body || {};
    console.log('[location] raw POST body:', req.body);
    // Accept messy payloads: try to coerce values to numbers and detect swapped coordinates
    let latitude = rawLat;
    let longitude = rawLng;
    // coerce strings to numbers when possible
    const toNum = (v: any) => {
      if (v === undefined || v === null) return NaN;
      const n = Number(v);
      if (!isNaN(n)) return n;
      // try extract numeric substring
      const m = String(v).match(/[+-]?\d+(?:\.\d+)?/g);
      if (!m) return NaN;
      return Number(m.join(''));
    };
    latitude = toNum(latitude);
    longitude = toNum(longitude);
    // If coords appear swapped (lat outside [-90,90] but lng inside), swap them
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      if (Math.abs(latitude) > 90 && Math.abs(longitude) <= 90) {
        console.warn('[location] detected lat/lng likely swapped in payload — swapping values');
        const t = latitude;
        latitude = longitude;
        longitude = t;
      }
    }
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ success: false, message: "latitude, longitude required" });
    }

    // Prefer driver id from authenticated token (req.user) when available to avoid id mismatch
    let id: number | null = null;
    if (req.user && (req.user.MaTX || req.user.id || req.user.MaTK)) {
      id = Number(req.user.MaTX || req.user.id || req.user.MaTK);
    } else if (bodyDriverId) {
      id = Number(bodyDriverId);
    }

    if (!id) {
      return res.status(400).json({ success: false, message: "driverId missing (provide in token or body)" });
    }

    setDriverPosition(id, Number(latitude), Number(longitude));
    // After updating position, check schedules for this driver and notify parents
    (async () => {
      try {
        // Try fetching schedules using a tolerant set of account id variants
        let schedules: any[] = await getDriverSchedulesByAccountId(id);
        if ((!schedules || schedules.length === 0) && typeof id === 'number') {
          // Try common mappings: account id might be driverId +/- 13
          const altIds = [id - 13, id + 13].filter(n => n > 0);
          for (const alt of altIds) {
            schedules = await getDriverSchedulesByAccountId(alt);
            if (schedules && schedules.length > 0) {
              break;
            }
          }
        }
        if (!schedules || schedules.length === 0) return;

        const now = new Date();
        // use local date string to compare with stored scheduleDate (YYYY-MM-DD)
        const localY = now.getFullYear();
        const localM = String(now.getMonth() + 1).padStart(2, '0');
        const localD = String(now.getDate()).padStart(2, '0');
        const todayStr = `${localY}-${localM}-${localD}`;

        for (const sched of schedules) {
          // only consider today's schedules (compare local YYYY-MM-DD)
          if (String(sched.scheduleDate) !== todayStr) continue;

          // parse time window: allow notifications within [startTime - 30min, endTime + 30min]
          const parseHm = (s: string) => {
            if (!s) return null;
            const hhmm = s.split(':');
            const hh = Number(hhmm[0] || 0);
            const mm = Number(hhmm[1] || 0);
            return hh*60 + mm;
          };
          const startMin = parseHm(sched.startTime) ?? 0;
          const endMin = parseHm(sched.endTime) ?? 24*60;
          const nowMin = now.getHours()*60 + now.getMinutes();
          if (nowMin < startMin - 30 || nowMin > endMin + 30) continue;

          // get route stops
          const routeId = sched.routeId;
          const route = await getRouteStops(routeId);
          if (!route || !route.stops) continue;

          // parse studentListRaw into objects
          const studentsRaw: string = sched.studentListRaw || '';
          const students = studentsRaw.split(';').map((item: string) => {
            const parts = item.split('|');
            return {
              studentName: (parts[0] || '').trim(),
              maHS: Number(parts[1] || 0),
              dob: parts[2] || '',
              class: parts[3] || '',
              status: Number(parts[4] || 0),
              parentName: (parts[5] || '').trim(),
              parentPhone: (parts[6] || '').trim(),
              parentId: Number(parts[7] || 0),
              tenDon: (parts[8] || '').trim(),
              tenTra: (parts[9] || '').trim()
            };
          }).filter((s: any) => s && s.maHS);

          // for each stop, check distance and notify parents of students whose TenDon or TenTra matches
          for (const stop of route.stops) {
            const dist = haversineMeters(Number(latitude), Number(longitude), Number(stop.ViDo), Number(stop.KinhDo));
            // threshold in meters — notify when within 150 meters
            if (dist <= 150) {
              // find students for this stop
              const stopName = String(stop.TenTram || '').trim().toLowerCase();
              const studentsAtStop = students.filter((s: any) => {
                const tenDon = String(s.tenDon || '').trim().toLowerCase();
                const tenTra = String(s.tenTra || '').trim().toLowerCase();
                return tenDon === stopName || tenTra === stopName;
              });
              for (const s of studentsAtStop) {
                const key = `notif_${id}_${sched.id}_${s.maHS}`; // driver_schedule_student key
                if (!shouldNotify(key, 5*60*1000)) continue; // cooldown 5 minutes
                // build message
                const action = s.tenDon === stop.TenTram ? 'đón' : 'trả';
                const message = `Xe sắp tới trạm ${stop.TenTram} để ${action} học sinh ${s.studentName}.`;
                try {
                  const maTB = await createNotification({ NoiDung: message });
                  await sendNotificationToAccount(maTB, s.parentId);
                } catch (e) {
                  // Silently handle notification errors
                }
              }
            }
          }
        }
      } catch (e) {
        // Silently handle schedule checking errors
      }
    })();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /driver/location/:driverId
export const getDriverLocation = (req: Request, res: Response) => {
  try {
    const driverId = Number(req.params.driverId);
    if (!driverId) return res.status(400).json({ success: false, message: "driverId required" });
    // Try exact id first
    let pos = getDriverPosition(driverId);
    // Some deployments use MaTK (account id) while others use MaTX (driver id).
    // Older data in this project maps MaTK = MaTX + 13 — try neighbouring keys to be tolerant.
    if (!pos) {
      try {
        const alt1 = driverId - 13;
        if (alt1 > 0) pos = getDriverPosition(alt1);
      } catch {}
    }
    if (!pos) {
      try {
        const alt2 = driverId + 13;
        pos = getDriverPosition(alt2);
      } catch {}
    }
    if (!pos) return res.status(404).json({ success: false, message: "Position not found" });
    // Prevent browser caching/conditional requests for live position polling
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return res.json({ success: true, position: pos });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
