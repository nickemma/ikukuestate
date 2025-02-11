import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { API_URL } from "../config/Api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const DiscoverRegion = () => {
  const sliderRef = useRef(null);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    dots: true,
    infinite: regions.length > 1, // Only infinite if more than 1 region
    speed: 500,
    slidesToShow: regions.length >= 3 ? 3 : regions.length, // Dynamic slide count
    slidesToScroll: 1,
    swipe: true,
    draggable: regions.length > 1,
    centerMode: regions.length === 1, // Center single region
    variableWidth: regions.length === 1, // Adjust width for single region
    autoplay: regions.length > 1,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: regions.length >= 2 ? 2 : regions.length,
          centerMode: regions.length === 1,
          variableWidth: regions.length === 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          variableWidth: false,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/regions`);
        setRegions(response.data.data);
      } catch (err) {
        setError("Failed to load regions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-gray-100 py-10">
      <div className="text-center mb-10">
        <div className="mb-4">
          <h2 className="text-2xl text-red-500">GLOBAL REGIONS</h2>
          <h3 className="text-2xl font-medium italic">
            Wherever you&apos;re going, we can take you there
          </h3>
        </div>
        <Link to="/region">
          <button className="h-10 bg-red-600 px-6 text-white text-xl rounded-md">
            Discover Global Regions
          </button>
        </Link>
      </div>

      {regions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-xl">No regions available yet</p>
        </div>
      ) : (
        <div className="px-8">
          <Slider ref={sliderRef} {...settings} className="mt-10">
            {regions.map((item) => (
              <div key={item._id} className="px-2 cursor-pointer">
                <div
                  className={`m-4 relative ${
                    regions.length === 1 ? "max-w-2xl mx-auto" : ""
                  }`}
                >
                  <figure className="overflow-hidden rounded-md shadow-md">
                    <img
                      src={item.image}
                      alt={`Photo of ${item.city}`}
                      className="object-cover w-full h-[30rem] transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </figure>
                  <h3 className="text-center text-xl font-semibold mt-4">
                    <Link
                      to={`/region/${item._id}`}
                      className="text-gray-800 hover:text-red-500"
                    >
                      {item.city}
                    </Link>
                  </h3>
                  <span className="block text-center text-red-600 mt-2">
                    <Link
                      to={`/region/${item._id}`}
                      className="flex items-center justify-center text-lg font-medium hover:underline"
                    >
                      Discover
                      <svg
                        className="ml-1 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14m-7-7l7 7-7 7"
                        ></path>
                      </svg>
                    </Link>
                  </span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default DiscoverRegion;
