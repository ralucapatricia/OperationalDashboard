import React from "react";
import { Tabs, Tab } from "@mui/material";
import { styled } from "@mui/system";
import { tabClasses } from "@mui/base/Tab";

const blue = {
  200: "#001f67",
  400: "#b8caf2",
  500: "rgba(224, 224, 224, 1)",
};

const StyledTabs = styled(Tabs)({
  backgroundColor: blue[500],
  width: "100%",
});

const StyledTab = styled(Tab)({
  fontFamily: "IBM Plex Sans, sans-serif",
  color: blue[200],
  fontWeight: "bold",
  backgroundColor: "transparent",
  flexGrow: 1,
  flexBasis: 0,
  lineHeight: "1.5",
  margin: "0 6px",
  border: "none",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: blue[400],
  },
  "&:focus": {
    color: "#fff",
  },
  [`&.${tabClasses.selected}`]: {
    backgroundColor: "#fff",
    color: blue[200],
  },
});

export default function TabsBar({ currentTab, handleChangeTab }) {
  return (
    <StyledTabs
      value={currentTab}
      onChange={handleChangeTab}
      variant="fullWidth"
    >
      <StyledTab value={1} label="ALL TICKETS" />
      <StyledTab value={2} label="BACKLOG" />
      <StyledTab value={3} label="CLOSED" />
    </StyledTabs>
  );
}
