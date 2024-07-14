import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PublicRoute = ({ children }) => {
  const { userToken } = useContext(UserContext);
  return userToken ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
