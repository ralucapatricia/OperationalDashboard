import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return( 
    <>
  <h2>Homepage</h2>
  <nav>
  <ul>
    <li><Link to="/">Log-in</Link></li>
    <li><Link to="/grafice">Grafice</Link></li>
  </ul>
</nav>
</>
);
}

export default Home;