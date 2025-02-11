import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../config/Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const setAuthCookies = (accessToken, refreshToken) => {
    Cookies.set("accessToken", accessToken, {
      expires: 1 / 24, // set for 1 hour
      secure: false, // Set to false for development
      sameSite: "lax", // Use "lax" for development
      path: "/", // Ensure the path is correct
    });

    Cookies.set("refreshToken", refreshToken, {
      expires: 7, // 7 days
      secure: false, // Set to false for development
      sameSite: "lax", // Use "lax" for development
      path: "/", // Ensure the path is correct
    });
  };

  // Check for an existing user in localStorage on app initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedUser && storedAccessToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
    }
  }, []);

  // ✅ Login function: Store token in cookies & update user state
  const login = async (userData, accessToken, refreshToken) => {
    try {
      // Store the user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      // Store the access token in localStorage
      localStorage.setItem("accessToken", accessToken);
      // Store the access token and refresh token in cookies
      setAuthCookies(accessToken, refreshToken);
      setUser(userData);
      setAccessToken(accessToken); // Store accessToken in state
      setError(null);
    } catch (err) {
      setError("Failed to log in");
      console.error(err);
    }
  };

  // ✅ Refresh access token
  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      // Update cookies with the new access token
      Cookies.set("accessToken", data.accessToken, {
        expires: 1 / 24, // 1 hour
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      // Update the access token in the state
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.error("Failed to refresh token", err);
      logout(); // Log the user out if refreshing the token fails
      return null;
    }
  };

  // ✅ Update user context
  const updateUserContext = (updatedUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser, // Merge the new updates
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let accessToken;

        // If no access token, try refreshing it
        if (!accessToken) {
          accessToken = await refreshAccessToken();
        }

        // If still no access token, log the user out
        if (!accessToken) {
          logout();
          return;
        }

        // Fetch user data using the access token
        const response = await axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        setUser(response.data);
        setAccessToken(accessToken); // Ensure accessToken is set in state
      } catch (err) {
        console.error("Failed to fetch user", err); // Log 7: Indicate an error occurred
        logout();
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout function: Clear user state & remove token cookie
  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Failed to log out", err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        accessToken,
        updateUserContext,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
