
import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default function RateBar() {

  const value = 100;

  return (
    <Box
      sx={{
        width: 150,
        // backgroundColor: "#f5f5f5",
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
              backgroundColor: "#2e8b57"
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
