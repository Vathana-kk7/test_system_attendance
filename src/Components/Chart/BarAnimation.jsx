
import * as React from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";

export default function AttendanceChart({ chartData }) {

  const presentData = chartData?.presentData?.length > 0 ? chartData.presentData : [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const absentData = chartData?.absentData?.length > 0 ? chartData.absentData : [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const permissionData = chartData?.permissionData?.length > 0 ? chartData.permissionData : [0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  const xLabels = chartData?.xLabels?.length > 0 ? chartData.xLabels : [
    "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7",
    "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: 350,
        backgroundColor: "#fff",
        padding: 2,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{marginBottom:"10px"}}>14-Day Attendance Trend</h3>

      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: xLabels
          }
        ]}
        series={[
          {
            data: presentData,
            label: "Present",
            color: "#2ECC71"
          },
          {
            data: absentData,
            label: "Absent",
            color: "#dc3545"
          },
          {
            data: permissionData,
            label: "Permission",
            color: "#F0AD4E"
          }
        ]}
        height={300}
        margin={{ top: 20, bottom: 40, left: 40, right: 10 }}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" }
          }
        }}
        sx={{
          "& .MuiBarElement-root": {
            transition: "all 0.4s ease"
          }
        }}
      />
    </Box>
  );
}

