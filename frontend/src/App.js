import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Emulator from './components/Emulator';
import { UserProvider, UserContext } from './context/UserContext';
import PublicRoute from './components/PublicRoute';

const ProtectedRoute = ({ children }) => {
  const { userToken } = useContext(UserContext);
  return userToken ? children : <Navigate to="/login" />;
};

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
