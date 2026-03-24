
import * as React from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";

export default function AttendanceChart() {

  // 14-day data
  const presentData = [0,0,0,0,0,0,0,7,6,8,5,0,0,0];
  const absentData = [0,0,0,0,0,0,0,4,2,3,2,0,0,0];
  const permissionData = [0,0,0,0,0,0,0,1,1,1,1,0,0,0];

  const xLabels = [
    "Feb 23",
    "Feb 24",
    "Feb 25",
    "Feb 26",
    "Feb 27",
    "Feb 28",
    "Mar 1",
    "Mar 2",
    "Mar 3",
    "Mar 4",
    "Mar 5",
    "Mar 6",
    "Mar 7",
    "Mar 8",
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

