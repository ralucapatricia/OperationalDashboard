import React from 'react';
import { Link } from 'react-router-dom';
import "./log-in.css";
import Particles from "./Particles.js";

const Login = () => {

  return (
    <>
    <Particles id="tsparticles"></Particles>
      <div id="log-in">

        <div id="half1">
          <div id="glass">
            <div id='inner'>
              <h1 id="h1">Log In</h1>
              <form>
              <input type="email" placeholder="Enter your Email" name="email" required id='ps'></input><br></br>
              <input type="password" placeholder="Enter Password" name="psw" required id='ps'></input>
              </form>
              <button id='btn'>Login</button>
              <p id="whitep2">Don't have an account?</p>
              <Link to="/register" id='register'>Sign up</Link>
              <nav>
                <ul>
                  <li><Link to="/homepage">Homepage</Link></li>
                  <li><Link to="/grafice">Grafice</Link></li>
                </ul>
              </nav>
              </div>
            </div>
          </div>
        </div>

    </>
  );
};

export default Login;

