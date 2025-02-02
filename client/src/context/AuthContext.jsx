import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const login = async (userData, tokenData) => {
    try {
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", tokenData);
      setError(null);
    } catch (err) {
      setError("Failed to log in", err);
    }
  };
  // ✅ New: Function to logout the user context
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ✅ New: Function to update the user context
  const updateUserContext = (updatedUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser, // Merge the new updates
    }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, error, updateUserContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
