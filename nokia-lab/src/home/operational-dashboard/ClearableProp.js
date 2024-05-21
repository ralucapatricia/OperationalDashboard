import * as React from "react";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";

export default function ClearableProp({ handleDateChange, value, label }) {
  const [cleared, setCleared] = useState(false);   
  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <DemoItem>
          <DatePicker
            sx={{ width: 160 }}
            value={value}
            onChange={(newValue) => {
              handleDateChange(newValue);
            }}
            slotProps={{
              field: { clearable: true, onClear: () => setCleared(true) },
            }}
            label={label}
            
          />
        </DemoItem>

        {cleared && (
          <Alert
            sx={{ position: "absolute", bottom: 0, right: 0 }}
            severity="success"
          >
            Field cleared!
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
}
