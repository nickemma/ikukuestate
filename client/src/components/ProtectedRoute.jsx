import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a short delay to allow useEffect in AuthContext to retrieve user
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  // Prevent redirection until `user` is loaded
  if (isLoading) return null;

  // Redirect if no user
  if (!user) {
    return <Navigate to="/" />;
  }

  // If role restriction exists and user doesn't match, redirect
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/user/dashboard" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;
