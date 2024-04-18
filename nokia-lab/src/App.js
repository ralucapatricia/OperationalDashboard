import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home/home'
import Login from './log-in/log-in'
import Grafice from './grafice/grafice'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/homepage" element={<Home/>} />
          <Route path="/grafice" element={<Grafice/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
