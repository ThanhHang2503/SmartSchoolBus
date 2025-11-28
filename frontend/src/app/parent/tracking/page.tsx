"use client";
import React, { useState } from "react";
import MyMap from "@/components/Map";
import Paper from "@mui/material/Paper";
 
const Tracking: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1); // Tuyến đường được chọn
  // Determine driver's id to track for this parent by asking backend which driver is assigned today
  const [driverIdToTrack, setDriverIdToTrack] = useState<number | null>(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [driverError, setDriverError] = useState<string | null>(null);

  React.useEffect(() => {
    // Try to get parent's MaTK from localStorage user object
    try {
      const userRaw = localStorage.getItem('user');
      if (!userRaw) return;
      const user = JSON.parse(userRaw);
      const maTK = user?.id || user?.MaTK || user?.maTK;
      if (!maTK) return;

      setLoadingDriver(true);
      fetch(`http://localhost:5000/parent/driver-location/${maTK}`)
        .then(async (r) => {
          if (!r.ok) {
            const txt = await r.text();
            throw new Error(txt || r.statusText);
          }
          return r.json();
        })
        .then((data) => {
          // backend returns { success:true, driver: { MaTX, MaTK }, position }
          const maTX = data?.driver?.MaTX;
          if (maTX) setDriverIdToTrack(Number(maTX));
          else setDriverError('Không tìm thấy tài xế cho lịch trình hôm nay.');
        })
        .catch((err) => {
          console.warn('Failed to fetch driver for parent', err);
          setDriverError('Lỗi khi lấy thông tin tài xế');
        })
        .finally(() => setLoadingDriver(false));
    } catch (e) {
      console.warn('parent tracking init error', e);
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Theo dõi hành trình</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm" style={{ height: "520px" }}>
        <Paper elevation={0} sx={{ height: "100%" }}>
          <MyMap routeId={selectedRouteId} useDriverPosition={true} driverId={driverIdToTrack ?? undefined} />
        </Paper>
      </div>
    </div>
  );
};

export default Tracking;
