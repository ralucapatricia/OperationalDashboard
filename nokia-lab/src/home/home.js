import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";

import "./home.css";
import { getUser } from "./operational-dashboard/service/OperationalDashboardService"

const Home = () => {
  const [userName, setUserName] = useState('');

  const fetchUserName = async () => {
    try {
      const data = await getUser();
      setUserName(data.USERNAME);
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  useEffect(() => {
    fetchUserName(); 
  }, []);

  return (
    <div className="bg">
      <div id="page-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>KPI Guardian</h1>
        <Link to="/">
          <ExitToAppIcon style={{ fontSize: 50, color: "white" }} />
        </Link>
      </div>
      <div id="main-div">
        <h1 id="header">Welcome, {userName}!</h1> 
        <Button id="Button" variant="outlined" href="/grafice">Graphics</Button>
        <Button id="Button" variant="outlined" href="/OperationalDashboard">Dashboard</Button>
      </div>
    </div>
  );
};

export default Home;
