import axios from "axios";
export const API_URL = "https://ikukuestate-api.vercel.app/api/v1";
// export const API_URL = "http://localhost:5000/api/v1";

// Create a configured axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
