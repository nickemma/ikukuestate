import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/Api";

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        // Check if passwords match
        if (form.password !== form.confirmpassword) {
          return toast.error("Passwords do not match.");
        }

        // Registration flow
        const { data } = await axios.post(`${API_URL}/auth/register`, form);
        console.log(data);
        setIsVerificationSent(true);
        toast.success("Verification email sent. Please check your inbox.");
      } else {
        // Login flow
        const { email, password } = form;
        const { data } = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });
        // Store user data and token in local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        login(data.user, data.token);
        toast.success("Logged in successfully!");
        navigate("/user/dashboard");
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        {isVerificationSent ? (
          <p className="text-center text-gray-700">
            Please verify your email before logging in.
          </p>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            {isSignUp && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInputChange}
                  className="w-full mb-4 px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInputChange}
                  className="w-full mb-4 px-4 py-2 border rounded-md"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full mb-4 px-4 py-2 border rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full mb-4 px-4 py-2 border rounded-md"
            />
            {isSignUp && (
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={form.confirmpassword}
                onChange={handleInputChange}
                className="w-full mb-4 px-4 py-2 border rounded-md"
              />
            )}
            <button
              className="w-full py-2 bg-red-600 text-white rounded-md"
              onClick={handleSubmit}
            >
              {isSignUp ? "Register" : "Login"}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                className="text-red-600 cursor-pointer"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </>
        )}
        <button
          className="mt-4 w-full py-2 bg-gray-300 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

AuthModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;
