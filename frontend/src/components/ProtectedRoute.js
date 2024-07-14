import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { userToken } = useContext(UserContext);
    return userToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;