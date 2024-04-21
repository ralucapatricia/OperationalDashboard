import React from 'react';
import { Link } from 'react-router-dom';
import "./log-in.css";
import Particles from "./Particles.js";

const Register = () => {
    return(
        <>
            <Particles id="tsparticles"></Particles>
      <div id="log-in">

        <div id="half1">
          <div id="glass2">
            <div id='inner'>
              <h1 id="h1">Register</h1>
              <form>
              <input type="text" placeholder="Enter Username" name="uname" required id='ps1'></input><br></br>
              <input type="email" placeholder="Enter your Email" name="email" required id='ps1'></input><br></br>
              <input type="password" placeholder="Enter Password" name="psw" required id='ps1'></input><br></br>
              <input type="tel" placeholder="Enter Phone Number" name="uname" required id='ps1'></input><br></br>
              <input type="date" placeholder="Enter Birth Date" name="uname" required id='ps1'></input><br></br>
              </form>
              <button id='btn'>Register</button>
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
    )
}
export default Register;