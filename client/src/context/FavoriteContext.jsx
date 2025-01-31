import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { API_URL } from "../config/Api";
import { toast } from "react-toastify";

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav._id !== action.payload),
      };
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    loading: false,
  });

  const addFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      await axios.post(
        `${API_URL}/favorites`,
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch({ type: "ADD_FAVORITE", payload: propertyId });
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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      await axios.delete(`${API_URL}/favorites/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      const response = await axios.get(`${API_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: "SET_FAVORITES", payload: response.data });
      toast.success("Favorites loaded");
    } catch (error) {
      console.error(
        "Error fetching favorites:",
        error.response?.data || error.message
      );
      toast.error("Failed to load favorites.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
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
