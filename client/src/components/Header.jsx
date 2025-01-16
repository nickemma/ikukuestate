import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [isSignUp, setIsSignUp] = useState(false); // Controls Sign In/Sign Up form toggle
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsSignUp(false); // Reset to Sign In form by default
  };

  const toggleSignUp = () => {
    setIsSignUp(true); // Switch to Sign Up form
  };

  const toggleSignIn = () => {
    setIsSignUp(false); // Switch to Sign In form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 z-10 flex items-center justify-between w-full px-6 text-lg font-bold bg-white border-2 border-red-200 h-[7rem]">
        <div className="w-40 bg-red-600 h-[7rem] flex items-center justify-center text-white">
          LOGO
        </div>
        <div className="flex space-x-8">
          <Link to="/buy">BUY</Link>
          <Link to="/rent">RENT</Link>
          <Link to="/agent">AGENT</Link>
          <Link to="/region">REGION</Link>
          <Link to="/sell">SELL</Link>
          <Link to="/service">SERVICE</Link>
          <button
            onClick={toggleModal}
            className="w-56 h-10 text-white bg-red-600 rounded-md"
          >
            SIGN IN / SIGN UP
          </button>
        </div>
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-1/3 bg-white rounded-lg shadow-lg">
            {/* Close Icon */}
            <button
              className="absolute text-red-600 top-8 right-4"
              onClick={toggleModal}
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {isSignUp ? (
                // Sign Up Form
                
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-center text-red-600">
                    Sign Up for an Account
                  </h2>
                  <form className="space-y-6">
                    <div className="flex pb-4 space-x-4 border-b-2 border-gray-300"> 
                    <input
                      type="name"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="First Name"
                     className="w-full px-4 py-3 focus:outline-none"
                    />
                    <input
                      type="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 focus:outline-none"
                    />
                    </div>
                    <div className="flex pb-4 space-x-4 border-b-2 border-gray-300"> 
                    <input
                      type="Address"
                      name="Email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-3 focus:outline-none"
                    />
                    <input
                      type="contact"
                      name="contact"
                      value={formData.Phone}
                      onChange={handleChange}
                      placeholder="Phone"
                    className="w-full px-4 py-3 focus:outline-none"
                    />
                   </div>
                    <div className="flex pb-4 space-x-4 border-b-2 border-gray-300"> 
                    <input
                      type="password"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      placeholder="Password"
                     className="w-full px-4 py-3 focus:outline-none"
                    />
                    <input
                      type="password"
                      name="Confirm Password"
                      value={formData.ConfirmPassword}
                      onChange={handleChange}
                      placeholder=" Confirm Password"
                      className="w-full px-4 py-3 focus:outline-none"
                    />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 font-bold text-white bg-red-600 rounded pl y-3 ml-[30rem] h-12 "
                    >
                      Sign Up
                    </button>
                  </form>
                  
                  <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <button
                      onClick={toggleSignIn}
                      className="font-bold text-red-600 underline"
                    >
                      Sign In
                    </button>
                  </p>

                  <div className="flex items-center ml-6 space-x-2">
                <input className="mb-12"
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData({ ...formData, consent: e.target.checked })
                  }
                />
                <label className="mt-6 font-bold">
                  By submitting your information, you consent to receive marketing/promotional content by email, SMS, and/or phone. Message and data rates may apply. You may opt out at any time per our{' '}
                  <span className="text-red-500">Privacy Policy.</span>
                </label>
              </div>
                  
                </div>

              ) : (
                // Sign In Form
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-center text-red-600">
                    Sign In to Your Account
                  </h2>
                  <form className="space-y-6">
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none"
                    />
                    <input
                      type="password"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="px-6 py-2 font-bold text-red-600 underline"
                      >
                        Forgot Password?
                      </button>
                      <button className="px-6 py-2 font-bold text-white bg-red-600 rounded">
                        Sign in
                      </button>
                    </div>
                  </form>
                  <p className="mt-4 font-bold text-center text-red-600 underline">
                    New to Ikukuestate?{" "}
                    </p>
                    <p>
                    <button
                      onClick={toggleSignUp}
                      className="font-bold text-red-600 underline ml-[16.5rem]"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
