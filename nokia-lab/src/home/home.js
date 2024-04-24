import React from 'react';
import { Link } from "react-router-dom";


const Home = () => {
  return( 
    <>
     <h1>Homepage</h1>
      {/* <li><Link to="/">Log-in</Link></li> */}
      <li><Link to="/grafice">Grafice</Link></li>
      <li><Link to="/OprationalDashboard">OprationalDashboard</Link></li>

    </>
  );
}
export default Home;
