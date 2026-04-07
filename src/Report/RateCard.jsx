
import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default function RateBar({ rate = 0, present = 0, absent = 0, permission = 0 }) {

  const value = rate;
  const getColor = (val) => {
    if (present > 0 && absent === 0 && permission === 0) return "#2e8b57";
    if (absent > 0 && present === 0 && permission === 0) return "#dc3545";
    if (permission > 0 && present === 0 && absent === 0) return "#F0AD4E";
    if (val === 100) return "#2e8b57";
    if (val === 0) return "#dc3545";
    if (val === 50) return "#F0AD4E";
    if (val >= 80) return "#2e8b57";
    if (val >= 50) return "#F0AD4E";
    return "#dc3545";
  };

  return (
    <Box
      sx={{
        width: 150,
        padding: "10px 15px",
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderRadius: "3px"
      }}
    >
      
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: getColor(value)
            }
          }}
        />
      </Box>

      <Typography sx={{ fontWeight: 600 }}>
        {value}%
      </Typography>

    </Box>
  );
}
