import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Screens/Register';
import Login from './Screens/Login';
import Home from './Screens/Home';
import Leaderboard from './Screens/Leaderboard';
import Emulator from './Screens/Emulator';
import { UserProvider } from './context/UserContext';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emulator"
            element={
              <ProtectedRoute>
                <Emulator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
