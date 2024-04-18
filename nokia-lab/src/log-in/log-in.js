import React from 'react';
import { Link } from "react-router-dom";

const Login = () =>  {
  return(
    <>
      <h2>Log-in</h2>
      <nav>
      <ul>
        <li><Link to="/homepage">Homepage</Link></li>
        <li><Link to="/grafice">Grafice</Link></li>
      </ul>
</nav>
    </>
  ) 
}

export default Login;