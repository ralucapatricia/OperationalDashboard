import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./log-in.css";
import Particles from "./Particles.js";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios.post("http://localhost:80/api/log-in/", formData);
      if (response.data === "Success") {
        navigate("/homepage");
      } else {
        setError(response.data);
        alert(response.data);
      }
    } catch (error) {
      setError("An error occurred during login.");
    }
  };

  return (
    <>
      <Particles id="tsparticles"></Particles>
      <div id="log-in">
        <div id="half1">
          <div id="glass">
            <div id="inner">
              <h1 id="h1">Log In</h1>
              <form onSubmit={handleLogin} className="form">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  name="email"
                  required
                  id="ps"
                ></input>
                <br></br>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="psw"
                  required
                  id="ps"
                ></input>
                <input type="submit" name="" id="btn" value="Log-in"></input>
              </form>

              <p id="whitep2">Don't have an account?</p>
              <Link to="/register" id="register">
                Sign up
              </Link>
              <nav></nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
