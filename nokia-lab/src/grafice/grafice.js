import React from 'react';
import { Link } from "react-router-dom";

const Grafice = () => {
  return (
    <>
  <h2>Grafice</h2>
  <nav>
  <ul>
    <li><Link to="/">Log-in</Link></li>
    <li><Link to="/homepage">Homepage</Link></li>
  </ul>
</nav>
</>
  );
};

export default Grafice;