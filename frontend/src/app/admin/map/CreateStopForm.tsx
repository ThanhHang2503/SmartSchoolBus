"use client";

import React, { useState } from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";

type Props = {
  onCreate: (ten: string, diachi: string, kinh: number, vi: number) => Promise<void>;
};

const CreateStopForm: React.FC<Props> = ({ onCreate }) => {
  const [ten, setTen] = useState("");
  const [diachi, setDiachi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use OpenStreetMap Nominatim for geocoding the address to lat/lon.
  const geocodeAddress = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        // Nominatim requires a valid User-Agent/Referer in production; using origin is fine for dev.
      },
    });
    if (!res.ok) throw new Error(`Geocoding failed: ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const first = data[0];
    return { lat: Number(first.lat), lon: Number(first.lon) };
  };

  const submit = async () => {
    setError(null);
    if (!ten.trim() || !diachi.trim()) {
      setError("Vui lòng nhập tên trạm và địa chỉ");
      return;
    }

    setLoading(true);
    try {
      const geo = await geocodeAddress(diachi.trim());
      if (!geo) {
        setError("Không tìm thấy toạ độ cho địa chỉ này. Vui lòng kiểm tra lại địa chỉ.");
        setLoading(false);
        return;
      }

      await onCreate(ten.trim(), diachi.trim(), geo.lon, geo.lat);
      setTen("");
      setDiachi("");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Tạo trạm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, alignItems: 'center' }}>
      <TextField label="Tên trạm" value={ten} onChange={(e) => setTen(e.target.value)} fullWidth />
      <TextField label="Địa chỉ (nhập đủ địa chỉ để geocode)" value={diachi} onChange={(e) => setDiachi(e.target.value)} fullWidth />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Tạo trạm'}
        </Button>
        {error && <Box sx={{ color: 'error.main', ml: 2 }}>{error}</Box>}
      </Box>
    </Box>
  );
};

export default CreateStopForm;
