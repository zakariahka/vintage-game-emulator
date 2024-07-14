import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-navy p-4">
    <ul className="flex justify-around">
      <li><Link className="text-beige" to="/">Home</Link></li>
      <li><Link className="text-beige" to="/register">Register</Link></li>
      <li><Link className="text-beige" to="/login">Login</Link></li>
      <li><Link className="text-beige" to="/emulator">Emulator</Link></li>
      <li><Link className="text-beige" to="/leaderboard">Leaderboard</Link></li>
    </ul>
  </nav>
);

export default Navbar;
