import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import { tabClasses } from '@mui/base/Tab';

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const StyledTabs = styled(Tabs)({
  backgroundColor: blue[500],
  marginBottom: '16px',
  width: '100%',
});

const StyledTab = styled(Tab)({
  fontFamily: 'IBM Plex Sans, sans-serif',
  color: 'white',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  backgroundColor: 'transparent',
  width: '100%',
  lineHeight: '1.5',
  padding: '8px 12px',
  margin: '6px',
  border: 'none',
  borderRadius: '8px',
  display: 'flex',
//   justifyContent: 'center',
  '&:hover': {
    backgroundColor: blue[400],
  },
  '&:focus': {
    color: '#fff',
    outline: `3px solid ${blue[200]}`,
  },
  [`&.${tabClasses.selected}`]: {
    backgroundColor: '#fff',
    color: blue[600],
  },
});

export default function TabsBar({ currentTab, handleChangeTab }) {
  return (
    <StyledTabs value={currentTab} onChange={handleChangeTab}>
      <StyledTab value={1} label="ALL TICKETS" />
      <StyledTab value={2} label="OPEN" />
      <StyledTab value={3} label="CLOSED" />
    </StyledTabs>
  );
}
