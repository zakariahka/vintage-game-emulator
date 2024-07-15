import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="text-center px-4 py-8">
    <h1 className="text-4xl font-bold text-navy mb-6">Welcome to the Retro Game Console Emulator</h1>
    <p className="mt-4 text-xl text-navy">Play classic games, save your progress, and compete on the leaderboard.</p>
    <div className="mt-8">
      <Link to="/emulator" className="text-lg text-beige font-bold bg-brownRed px-4 py-2 rounded mr-4">Play Games</Link>
      <Link to="/leaderboard" className="text-lg text-beige font-bold bg-brownRed px-4 py-2 rounded">View Leaderboard</Link>
    </div>
  </div>
);

export default Home;
