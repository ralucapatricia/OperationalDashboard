import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/home'
import Login from './log-in/log-in'
import Grafice from './grafice/grafice'
import Register from './log-in/register';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/homepage" element={<Home/>} />
          <Route path="/grafice" element={<Grafice/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
