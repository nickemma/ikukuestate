import { useLocation } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import { TiSocialYoutubeCircular } from "react-icons/ti";

export default function Footer() {
  const location = useLocation();

  // Check if the current path is the admin path (adjust as necessary)
  const isAdminPage = location.pathname.startsWith("/admin");

  // Return null to not render the footer if on the admin page
  if (isAdminPage) return null;

  return (
    <footer className="bg-gray-200 p-10">
      <div className="flex flex-wrap justify-between mb-10">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="/logo.jpg"
            alt="The Agency Logo"
            className="w-24 h-24"
            loading="lazy"
          />
        </div>

        {/* About Section */}
        <div className="w-1/4">
          <h3 className="text-lg font-bold">The Agency</h3>
          <a href="/about" className="block mt-2 text-gray-600">
            About Us
          </a>
          <a href="/sign-in" className="block mt-2 text-gray-600">
            SignIn
          </a>
          <a href="/sign-up" className="block mt-2 text-gray-600">
            SignUp
          </a>
        </div>

        {/* Resources Section */}
        <div className="w-1/4">
          <h3 className="text-lg font-bold">Resources</h3>
          <a href="/properties" className="block mt-2 text-gray-600">
            Buy
          </a>
          <a href="/sell" className="block mt-2 text-gray-600">
            Sell
          </a>
          <a href="/regions" className="block mt-2 text-gray-600">
            Global Regions
          </a>
        </div>

        {/* Get In Touch Section */}
        <div className="w-1/4">
          <h3 className="text-lg font-bold">Get In Touch</h3>
          <p className="mt-4 text-sm text-gray-600">
            The most followed real estate brand
          </p>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://www.facebook.com/profile.php?id=100094256391231&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="h-6 w-6 text-gray-600" />
            </a>
            <a
              href="https://x.com/Ikuku_Tech_Prop?t=ILQpyPTEBCXay9H0pdq3ng&s=09"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="h-6 w-6 text-gray-600" />
            </a>
            <a
              href="https://youtube.com/@ikukutechproperty?si=xWsfcW8_uoJriboD"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TiSocialYoutubeCircular className="h-6 w-6 text-gray-600" />
            </a>
            <a
              href="https://www.instagram.com/ikuku_tech_property/profilecard/?igsh=M2t2azVhdm5wMWlv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="h-6 w-6 text-gray-600" />
            </a>
            <a
              href="https://linksharing.samsungcloud.com/aD3VSfA74h9v"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="h-6 w-6 text-gray-600" />
            </a>
            <a
              href="https://www.tiktok.com/@ikuku_tech_property?_t=ZM-8t95rNFJI6H&_r=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="h-6 w-6 text-gray-600" />
            </a>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* Footer Legal Section */}
      <div className="text-center">
        <ul className="flex justify-center space-x-8 mb-4">
          <li>
            <a href="/terms" className="text-gray-600">
              TERMS OF USE
            </a>
          </li>
          <li>
            <a href="/privacy-policy" className="text-gray-600">
              PRIVACY POLICY
            </a>
          </li>
          <li>
            <a href="/" className="text-gray-600">
              ACCESSIBILITY
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
