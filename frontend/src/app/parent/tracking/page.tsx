"use client";
import React, { useState } from "react";
import MyMap from "@/components/Map";
import Paper from "@mui/material/Paper";
 
const Tracking: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1); // Tuyến đường được chọn

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Theo dõi hành trình</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm" style={{ height: "520px" }}>
        <Paper elevation={0} sx={{ height: "100%" }}>
          <MyMap routeId={selectedRouteId} />
        </Paper>
      </div>
    </div>
  );
};

export default Tracking;
