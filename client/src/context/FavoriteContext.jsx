import { createContext, useContext, useReducer } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { API_URL } from "../config/Api";

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { favorites: [] });

  const addFavorite = async (propertyId) => {
    try {
      await axios.post(`${API_URL}/favorites`, {
        propertyId,
      });
      dispatch({ type: "ADD_FAVORITE", payload: propertyId });
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await axios.delete(`${API_URL}/favorites/${propertyId}`);
      dispatch({ type: "REMOVE_FAVORITE", payload: propertyId });
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const setFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites`);
      dispatch({ type: "SET_FAVORITES", payload: response.data });
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

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
