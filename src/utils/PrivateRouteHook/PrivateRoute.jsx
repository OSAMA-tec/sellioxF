import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../../Components/Spinner/Spinner';

const PrivateRoute = ({ children }) => {
    const {user, initialized} = useSelector((state) => state.user);

    if (!initialized) {
        // Show a loading spinner or nothing while initialization completes
        return <Spinner />;
      }
  return user ? children : <Navigate to="/auth/login"/>;
};

export default PrivateRoute;
