import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Define navigation links
  const navLinks = [
    { name: "BUY", link: "/properties" },
    { name: "SELL", link: "/sell" },
    { name: "ABOUT", link: "/about" },
    { name: "REGION", link: "/region" },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 z-10 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md"
            : isHomePage
            ? "bg-transparent"
            : "bg-white shadow-md"
        }`}
      >
        <div className="flex items-center justify-between py-3 px-8">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center justify-center text-white">
              <img
                src="/logo.jpg"
                alt="The Agency Logo"
                className="w-24 h-16 object-cover"
                loading="lazy"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {navLinks.map(({ name, link }) => (
              <Link
                key={name}
                to={link}
                className={`relative text-lg ${
                  isHomePage && !isScrolled ? "text-white" : "text-black"
                } after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full`}
              >
                {name}
              </Link>
            ))}
            {user ? (
              <button
                className="bg-red-600 text-white py-1 px-4 rounded"
                onClick={handleDropdownToggle}
              >
                {user.firstName}
                {isDropdownOpen && (
                  <div className="flex flex-col items-start p-2 absolute right-4 mt-[1rem] w-40 bg-white shadow-lg rounded-md z-10">
                    <Link
                      to="/user/dashboard"
                      className="relative mb-2 text-lg text-black after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {" "}
                      Dashboard
                    </Link>
                    <Link
                      to="/edit-profile"
                      className="relative mb-2 text-lg text-black after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {" "}
                      Edit Profile
                    </Link>
                    <button
                      className="relative flex items-center text-lg text-black after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FiLogOut className="pr-1 text-2xl" />
                      Log Out
                    </button>
                  </div>
                )}
              </button>
            ) : (
              <button
                className="w-40 h-10 text-white bg-red-600 rounded-md"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In / Sign Up
              </button>
            )}
            {isAuthModalOpen && (
              <AuthModal onClose={() => setIsAuthModalOpen(false)} />
            )}
          </div>
        </div>
      </nav>
      {/* Scroll to Top Icon */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-20 p-4 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-700 transition-all duration-300"
          aria-label="Scroll to Top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </>
  );
};

export default Header;
