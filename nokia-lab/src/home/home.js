import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./home.css";
import { getUser } from "./operational-dashboard/service/OperationalDashboardService";

const Home = () => {
  const [userName, setUserName] = useState('');
  const [isBasicUser, setIsBasicUser] = useState(false);
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const data = await getUser();
      setUserName(data.USERNAME);
      if(data.NUME_ROL === "user_basic"){
        setIsBasicUser(true);
      }
      console.log("rol:", data.NUME_ROL);
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  useEffect(() => {
    fetchUserName(); 
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:80/api/log-out/",
        {}
      );
      if (response.data.status === "Success") {
        navigate("/");
        alert("Logged out successfully");
        fetchUserName(); 
      } else {
        alert("An error occurred during logout: " + response.data.message);
      }
    } catch (error) {
      alert("An error occurred during logout: " + error.message);
    }
  };
  

  return (
    <div className="bg">
      <div id="page-name" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>KPI Guardian</h1>
        <ExitToAppIcon
          style={{ fontSize: 50, color: "white", cursor: "pointer" }}
          onClick={handleLogout}
        />
      </div>
      <div id="main-div">
        <h1 id="header">Welcome, {userName}!</h1>
        {!isBasicUser && <Button id="Button" variant="outlined" href="/grafice">Graphics</Button>}
        
        <Button id="Button" variant="outlined" href="/OperationalDashboard">Dashboard</Button>
      </div>
    </div>
  );
};

export default Home;