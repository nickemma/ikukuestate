import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowUp, FaBars, FaTimes } from "react-icons/fa"; // Import FaBars and FaTimes for the hamburger menu
import { FiLogOut } from "react-icons/fi";
import AuthModal from "../auth/AuthModal";
import EditProfileModal from "./EditProfileModal";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  // Handle scroll event to toggle navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
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

  // Toggle user dropdown
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Redirect to dashboard based on user role
  const handleDashboardRedirect = () => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
    setIsDropdownOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link or button is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 z-10 w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between py-3 px-8">
          {/* Conditional Rendering for Admin */}
          {user && user.role === "admin" ? (
            <div></div>
          ) : (
            <>
              {/* Logo for non-admin users */}
              <Link to="/">
                <div className="flex items-center justify-center text-white">
                  <img
                    src="/logo1.jpg"
                    alt="The Agency Logo"
                    className="w-32 h-24 object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>

              {/* Hamburger Menu for Mobile */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="text-black focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <FaTimes className="text-2xl" />
                  ) : (
                    <FaBars className="text-2xl" />
                  )}
                </button>
              </div>

              {/* Navigation Links for non-admin users (Desktop) */}
              <div className="hidden md:flex items-center space-x-4">
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
              </div>
            </>
          )}

          {/* User Dropdown or Sign In Button (Desktop) */}
          {user ? (
            <button
              className="bg-red-600 text-white py-1 px-4 rounded"
              onClick={handleDropdownToggle}
            >
              {user.firstName}
              {isDropdownOpen && (
                <div className="flex flex-col items-start p-2 absolute right-4 mt-[1rem] w-40 bg-white shadow-lg rounded-md z-10">
                  <button
                    className="relative mb-2 text-lg text-black after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={handleDashboardRedirect}
                  >
                    Dashboard
                  </button>
                  <Link
                    to="#"
                    className="relative mb-2 text-lg text-black after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => setIsEditProfileModalOpen(true)}
                  >
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
              className="hidden md:block w-40 h-10 text-white bg-red-600 rounded-md"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign In / Sign Up
            </button>
          )}
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="flex flex-col items-start px-8 py-4 space-y-4">
              {/* Navigation Links */}
              {navLinks.map(({ name, link }) => (
                <Link
                  key={name}
                  to={link}
                  className="relative text-lg text-black after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                  onClick={closeMobileMenu} // Close the mobile menu when a link is clicked
                >
                  {name}
                </Link>
              ))}

              {/* Sign In / Sign Up Button (Mobile) */}
              {!user && (
                <button
                  className="bg-red-600 text-white py-1 px-4 rounded"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    closeMobileMenu(); // Close the mobile menu when the button is clicked
                  }}
                >
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
      {isEditProfileModalOpen && (
        <EditProfileModal onClose={() => setIsEditProfileModalOpen(false)} />
      )}

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
