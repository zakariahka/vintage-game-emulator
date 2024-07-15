import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export const saveGame = (gameState) => api.post('/save_game', { gameState });
export const loadGame = () => api.get('/load_game');
export const getLeaderboard = () => api.get('/leaderboard');

export default api;
