import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { API_URL } from "../config/Api";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

const initialState = {
  favorites: [], // Ensure this is initialized as an array
};

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav._id !== action.payload),
      };
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const { accessToken, user } = useAuth();
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Fetch favorite listings when the user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && user.favorites && user.favorites.length > 0) {
        try {
          // Fetch the favorite listings based on the user.favorites array
          const response = await axios.get(`${API_URL}/favorites`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true, // Ensure credentials are sent
          });

          // Extract the array from the response
          const favoritesArray = response.data.favorites;

          dispatch({ type: "SET_FAVORITES", payload: favoritesArray });
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      }
    };

    fetchFavorites();
  }, [user, accessToken, dispatch]);

  const addFavorite = async (property) => {
    try {
      if (!accessToken) throw new Error("No token available");

      await axios.post(
        `${API_URL}/favorites`,
        { propertyId: property._id }, // Send propertyId to the backend
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch({ type: "ADD_FAVORITE", payload: property }); // Add the full property object to state
      toast.success("Added to favorites");
    } catch (error) {
      console.error(
        "Error adding favorite:",
        error.response?.data || error.message
      );
      toast.error(
        "Failed to add to favorites. Property may already be in favorites."
      );
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      if (!accessToken) throw new Error("No token available");

      await axios.delete(`${API_URL}/favorites/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch({ type: "REMOVE_FAVORITE", payload: propertyId });
      toast.success("Removed from favorites");
    } catch (error) {
      console.error(
        "Error removing favorite:",
        error.response?.data || error.message
      );
      toast.error("Failed to remove from favorites.");
    }
  };

  const setFavorites = async () => {
    try {
      if (!accessToken) throw new Error("No token available");

      const response = await axios.get(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch({ type: "SET_FAVORITES", payload: response.data });
      toast.success("Favorites loaded");
    } catch (error) {
      console.error(
        "Error fetching favorites:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    setFavorites(); // Fetch favorites on mount
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ state, addFavorite, removeFavorite, setFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};
