import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../../Components/Spinner/Spinner";

const PrivateRoute = ({ children }) => {
  const { user, initialized } = useSelector((state) => state.user);
  const location = useLocation();

  if (!initialized) {
    // Show a loading spinner or nothing while initialization completes
    return <Spinner />;
  }
  return user ? children : <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
};

export default PrivateRoute;
