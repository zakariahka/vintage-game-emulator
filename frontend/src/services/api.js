import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export const register = (username, password) => api.post('/register', { username, password });
export const login = (username, password) => api.post('/login', { username, password });
export const logout = () => api.post('/logout');
export const saveGame = (gameState) => api.post('/save_game', { gameState });
export const loadGame = () => api.get('/load_game');
export const getLeaderboard = () => api.get('/leaderboard');

export default api;
