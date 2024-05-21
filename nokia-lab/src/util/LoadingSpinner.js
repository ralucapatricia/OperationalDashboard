import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <div style={{
        fontSize: "34px",
        fontWeight: "bold",
        color: "#001F67",
        marginTop:"20px",
      }}>View Operational Dashboard...</div>
    </Box>
  );
}
