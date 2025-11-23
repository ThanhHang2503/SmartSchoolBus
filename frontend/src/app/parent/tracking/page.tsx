"use client";
import React from "react";
import { useState } from "react";
import Map from '../../../components/Map';
import Paper from '@mui/material/Paper';

const Tracking: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(2); 
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Theo dõi hành trình</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm text-center" style={{ height: "800px" }}>
            <Paper elevation={0} sx={{ height: "100%" }}>
              <Map routeId={selectedRouteId} />
            </Paper>
        <p className="mt-2 text-gray-500">
          Hiển thị vị trí xe buýt theo thời gian thực (demo placeholder)
        </p>
      </div>
    </div>
  );
};

export default Tracking;
