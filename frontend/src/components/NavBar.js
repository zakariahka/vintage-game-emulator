import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/emulator">Emulator</Link></li>
      <li><Link to="/leaderboard">Leaderboard</Link></li>
    </ul>
  </nav>
);

export default Navbar;
