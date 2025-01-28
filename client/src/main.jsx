import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import Notification from "./auth/Notification.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Notification />
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </AuthProvider>
);
