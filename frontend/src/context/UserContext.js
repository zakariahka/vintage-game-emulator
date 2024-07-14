import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
    };

    window.addEventListener('beforeunload', handleUnload);

    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('userToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setUserToken(storedToken);
    }

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const signup = async (userData) => {
    const url = 'http://127.0.0.1:5000/register';
    const response = await axios.post(url, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 200) {
      return { message: response.data.message };
    }

    setUser(response.data.user);
    setUserToken(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('userToken', response.data.token);
    
    return response;
  };

  const login = async (username, password) => {
    const url = 'http://127.0.0.1:5000/login';
    setIsLoading(true);

    const response = await axios.post(url, { username, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setIsLoading(false);

    if (response.status !== 200) {
      return { message: response.data.message };
    }

    setUser(response.data.user);
    setUserToken(response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('userToken', response.data.token);

    return response;
  };

  const logout = () => {
    setUser(null);
    setUserToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
  };

  return (
    <UserContext.Provider value={{ signup, login, logout, isLoading, user, userToken }}>
      {children}
    </UserContext.Provider>
  );
};
