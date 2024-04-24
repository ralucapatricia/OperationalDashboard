import React from 'react';

import Button from '@mui/material/Button';
import './home.css';


const Home = () => {
  return(
    <>
    <div id="page-name" >
      <h1>Main page</h1>
    </div >
    <div id="main-div">
      <h1 id="header">Welcome, userX! </h1>
      <Button id="Button" variant="outlined" href="/grafice">Graphics</Button>
      <Button id="Button" variant="outlined" href="/OperationalDashboard">Dashboard</Button>
      </div>
    </>
  );
}
export default Home;
