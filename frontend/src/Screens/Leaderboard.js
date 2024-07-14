import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard();
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {leaderboard.map((entry, index) => (
          <li key={index} className="border-b border-gray-200 py-2">{entry.username}: {entry.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
