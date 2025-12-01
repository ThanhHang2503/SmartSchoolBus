"use client"

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from "@mui/material";
import { getAllRoutes, addRoute, type IRouteDetail } from "../../../api/routeApi";
import { getAllStops, createStop, type IStop } from "../../../api/stopApi";
import { getRouteWithStops, addStopToRoute } from "../../../api/routeApi";
import { getAllDrivers, type IDriverDetail } from "../../../api/driverApi";
import CreateStopForm from "./CreateStopForm";
import MyMap from "../../../components/Map";

const AdminRoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<IRouteDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [speed, setSpeed] = useState<number | "">("");
  const [length, setLength] = useState<number | "">("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");
  const [stops, setStops] = useState<IStop[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [routeStops, setRouteStops] = useState<any[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<number | "">("");
  const [stopOrder, setStopOrder] = useState<number | "">("");
  
  // Driver location tracking
  const [drivers, setDrivers] = useState<IDriverDetail[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | "">("");
  const [driverLocation, setDriverLocation] = useState<{
    MaTX: number;
    ViDo: number;
    KinhDo: number;
    ThoiGian: string;
    HoTen: string;
  } | null>(null);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const list = await getAllRoutes();
      setRoutes(list);
    } catch (err) {
      console.error(err);
      setSnackSeverity("error");
      setSnackMessage("Không thể tải danh sách tuyến đường");
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const loadStops = async () => {
    try {
      const list = await getAllStops();
      setStops(list);
    } catch (err) {
      console.error("Không thể tải trạm dừng:", err);
    }
  };

  const loadRouteStops = async (maTD: number | null) => {
    if (!maTD) {
      setRouteStops([]);
      return;
    }
    try {
      const data = await getRouteWithStops(maTD);
      setRouteStops(data?.stops ?? []);
    } catch (err) {
      console.error("Không thể tải trạm của tuyến:", err);
      setRouteStops([]);
    }
  };

  useEffect(() => {
    loadRoutes();
    loadStops();
    loadDrivers();
  }, []);

  // Poll selected driver location every 5 seconds
  useEffect(() => {
    if (selectedDriverId === "" || !selectedDriverId) {
      setDriverLocation(null);
      return;
    }

    fetchDriverLocation(selectedDriverId);
    const interval = setInterval(() => fetchDriverLocation(selectedDriverId), 5000);
    
    return () => clearInterval(interval);
  }, [selectedDriverId, drivers]);

  const resetForm = () => {
    setFrom("");
    setTo("");
    setSpeed("");
    setLength("");
  };

  const handleCreate = async () => {
    if (!from.trim() || !to.trim() || speed === "" || length === "") {
      setSnackSeverity("error");
      setSnackMessage("Vui lòng điền đầy đủ thông tin");
      setSnackOpen(true);
      return;
    }

    try {
      const payload = {
        NoiBatDau: from.trim(),
        NoiKetThuc: to.trim(),
        VanTocTB: Number(speed),
        DoDai: Number(length),
      };
      const res = await addRoute(payload);
      const newId = res.MaTD;
      setSnackSeverity("success");
      setSnackMessage(`Tạo tuyến thành công (MaTD = ${newId})`);
      setSnackOpen(true);
      // Refresh list
      await loadRoutes();
      await loadStops();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setSnackSeverity("error");
      setSnackMessage(err?.message || "Tạo tuyến thất bại");
      setSnackOpen(true);
    }
  };

  const handleSelectRoute = (id: number) => {
    setSelectedRouteId(id);
    loadRouteStops(id);
  };

  const handleAddStopToRoute = async () => {
    if (!selectedRouteId) {
      setSnackSeverity("error");
      setSnackMessage("Vui lòng chọn tuyến trước");
      setSnackOpen(true);
      return;
    }
    if (selectedStopId === "") {
      setSnackSeverity("error");
      setSnackMessage("Vui lòng chọn trạm");
      setSnackOpen(true);
      return;
    }
    if (stopOrder === "") {
      setSnackSeverity("error");
      setSnackMessage("Vui lòng nhập thứ tự dừng");
      setSnackOpen(true);
      return;
    }

    try {
      await addStopToRoute({ MaTram: Number(selectedStopId), MaTD: selectedRouteId, ThuTuDung: Number(stopOrder) });
      setSnackSeverity("success");
      setSnackMessage("Thêm trạm vào tuyến thành công");
      setSnackOpen(true);
      // refresh route stops
      await loadRouteStops(selectedRouteId);
    } catch (err: any) {
      console.error(err);
      setSnackSeverity("error");
      setSnackMessage(err?.message || "Thêm trạm thất bại");
      setSnackOpen(true);
    }
  };

  const handleCreateStop = async (ten: string, diachi: string, kinh: number, vi: number) => {
    try {
      const res = await createStop({ TenTram: ten, DiaChi: diachi, KinhDo: kinh, ViDo: vi });
      setSnackSeverity("success");
      setSnackMessage(`Tạo trạm thành công (MaTram=${res.MaTram})`);
      setSnackOpen(true);
      await loadStops();
    } catch (err: any) {
      console.error(err);
      setSnackSeverity("error");
      setSnackMessage(err?.message || "Tạo trạm thất bại");
      setSnackOpen(true);
    }
  };

  const loadDrivers = async () => {
    try {
      const list = await getAllDrivers();
      setDrivers(list.filter(d => d.Active === 1));
    } catch (err) {
      console.error("Error loading drivers:", err);
    }
  };

  const fetchDriverLocation = async (driverId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/driver/location/${driverId}`);
      if (!response.ok) {
        setDriverLocation(null);
        return;
      }
      const data = await response.json();
      
      if (data && data.success && data.position && data.position.latitude && data.position.longitude) {
        const driver = drivers.find(d => d.MaTX === driverId);
        setDriverLocation({
          MaTX: driverId,
          ViDo: data.position.latitude,
          KinhDo: data.position.longitude,
          ThoiGian: new Date(data.position.updatedAt).toISOString(),
          HoTen: driver?.HoTen || "Unknown Driver",
        });
      } else {
        setDriverLocation(null);
      }
    } catch (err) {
      console.error("Error fetching driver location:", err);
      setDriverLocation(null);
    }
  };

  return (
    
    <Box sx={{ p: 3, maxWidth: "100%", mx: "auto" }}>
        <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                  Bản đồ tuyến và vị trí
                </Typography>
                <TextField
                  select
                  label="Chọn tài xế"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value === "" ? "" : Number(e.target.value))}
                  sx={{ minWidth: 200 }}
                  size="small"
                >
                  <MenuItem value="">-- Không hiển thị --</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver.MaTX} value={driver.MaTX}>
                      {driver.HoTen}
                    </MenuItem>
                  ))}

                </TextField>
              </Box>
        
              <Paper sx={{ height: 520, borderRadius: 3, overflow: "hidden", p: 0 }} elevation={1}>
                <MyMap 
                  routeId={selectedRouteId ?? undefined} 
                  driverLocations={driverLocation ? [driverLocation] : []}
                  showCurrentLocation={false}
                />
              </Paper>
            </Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Quản lý tuyến đường
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2} fontWeight={600}>
          Thêm tuyến đường mới
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField label="Nơi bắt đầu" value={from} onChange={(e) => setFrom(e.target.value)} fullWidth />
          <TextField label="Nơi kết thúc" value={to} onChange={(e) => setTo(e.target.value)} fullWidth />
          <TextField label="Vận tốc TB (km/h)" type="number" value={speed} onChange={(e) => setSpeed(e.target.value === "" ? "" : Number(e.target.value))} fullWidth />
          <TextField label="Độ dài (km)" type="number" value={length} onChange={(e) => setLength(e.target.value === "" ? "" : Number(e.target.value))} fullWidth />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleCreate}>
            Tạo tuyến
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2} fontWeight={600}>
          Danh sách tuyến đường {loading ? "(Đang tải...)" : ""}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Nơi bắt đầu</TableCell>
              <TableCell>Nơi kết thúc</TableCell>
              <TableCell>Vận tốc TB</TableCell>
              <TableCell>Độ dài</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((r) => (
              <TableRow
                key={r.id}
                hover
                onClick={() => handleSelectRoute(r.id)}
                sx={{ cursor: 'pointer', backgroundColor: selectedRouteId === r.id ? 'rgba(25,118,210,0.06)' : 'inherit' }}
              >
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.NoiBatDau}</TableCell>
                <TableCell>{r.NoiKetThuc}</TableCell>
                <TableCell>{r.VanTocTB}</TableCell>
                <TableCell>{r.DoDai}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Quản lý trạm cho tuyến */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" mb={2} fontWeight={600}>
          Quản lý trạm dừng cho tuyến
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            select
            label="Chọn tuyến"
            value={selectedRouteId ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedRouteId(Number.isNaN(id) ? null : id);
              if (!Number.isNaN(id)) loadRouteStops(id);
            }}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">-- Chọn --</MenuItem>
            {routes.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.id} — {r.NoiBatDau} → {r.NoiKetThuc}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Chọn trạm"
            value={selectedStopId}
            onChange={(e) => setSelectedStopId(e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">-- Chọn trạm --</MenuItem>
            {stops.map((s) => (
              <MenuItem key={s.MaTram} value={s.MaTram}>
                {s.TenTram} — {s.DiaChi}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Thứ tự dừng"
            type="number"
            value={stopOrder}
            onChange={(e) => setStopOrder(e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ width: 140 }}
          />

          <Button variant="contained" onClick={handleAddStopToRoute}>Thêm trạm vào tuyến</Button>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600}>Trạm trong tuyến</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên trạm</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Thứ tự</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routeStops.map((s, idx) => (
                <TableRow key={s.MaTram ?? idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{s.TenTram}</TableCell>
                  <TableCell>{s.DiaChi}</TableCell>
                  <TableCell>{s.ThuTuDung}</TableCell>
                </TableRow>
              ))}
              {routeStops.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">Chưa có trạm cho tuyến này</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600}>Tạo trạm mới</Typography>
          <CreateStopForm onCreate={handleCreateStop} />
        </Box>
      </Paper>

      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminRoutesPage;
