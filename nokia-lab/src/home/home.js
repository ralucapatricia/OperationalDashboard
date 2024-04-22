import React from 'react';
import { Link } from "react-router-dom";
import OprationalDashboard from './OperationalDashboard';

const Home = () => {
  return( 
    <>
      <h2>Homepage</h2>
      <li><Link to="/">Log-in</Link></li>
      <li><Link to="/grafice">Grafice</Link></li>
      <OprationalDashboard />
    </>
  );
}
export default Home;
