import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import DiscoverRegion from "../components/DiscoverRegion";
import DiscoverListing from "../components/DiscoverListing";
import DiscoverListingLand from "../components/DiscoverListingLand";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen">
        {/* Video Background */}
        <video
          muted
          autoPlay
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          poster="https://cdn-cws.datafloat.com/UPLOADS/AGY/webbuilder/fileUpload/HomeFlash/afuTitleVideo070220241851075230462.webp"
          src="https://cdn-cws.datafloat.com/UPLOADS/AGY/webbuilder/fileUpload/HomeFlash/afuTitleVideo062620241006086002891.mp4"
        ></video>

        {/* Video Overlay (Dim Effect) */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Hero Content */}
        <div className="mt-10 absolute flex flex-col items-start space-y-2 px-4 md:left-[16rem] md:top-[10rem] top-[7rem] text-white text-2xl md:text-[2.2rem] font-normal">
          <h2>
            Your window to the <br />
            <span className="italic">world&apos;s finest</span> real estate
          </h2>
        </div>

        {/* Explore Button */}
        <div className="w-full max-w-[60rem] absolute flex flex-col items-start space-y-2 bottom-20 px-4 md:left-[16rem] text-white">
          {/* Navigation Links */}
          <nav className="flex space-x-4 text-white">
            <a
              href="/properties"
              className="relative text-lg text-white after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
              title="Property Buy"
            >
              Buy
            </a>
            <a
              href="/sell"
              className="relative text-lg text-white after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
              title="Property Sell"
            >
              Sell
            </a>
          </nav>

          {/* Search Input */}
          <div className="relative flex items-center w-full max-w-3xl">
            <input
              type="text"
              id="txtKeyword"
              className="w-full h-12 md:h-16 pl-4 pr-12 text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter a location, address, or listing ID"
              aria-label="Search"
              autoComplete="off"
            />
            {/* Search Icon */}
            <FaArrowRight className="absolute right-4 text-gray-500" />
          </div>

          {/* Explore Listings */}
          <Link
            to="/properties"
            className="flex items-center space-x-2 hover:text-red-500"
          >
            <h3 className="text-lg">Explore Listings</h3>
            <FaArrowRight className="text-2xl" />
          </Link>
        </div>
      </div>

      {/* Discover Region Section */}
      <DiscoverRegion />

      {/* Featured Listings House */}
      <DiscoverListing />

      {/* Featured Listings Land */}
      <DiscoverListingLand />
    </>
  );
};

export default Home;
