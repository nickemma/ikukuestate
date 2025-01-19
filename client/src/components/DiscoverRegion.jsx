import { useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import region from "../api/region.json";

const DiscoverRegion = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipe: true,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // For tablets and smaller devices
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // For mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 py-10">
      {/* Global Regions Header */}
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

      {/* Slider Section */}
      <div className="px-8">
        <Slider ref={sliderRef} {...settings} className="mt-10">
          {region?.map((item) => (
            <div key={item?.id} className="px-2 cursor-pointer">
              <div className="m-4 relative">
                <figure className="overflow-hidden rounded-md shadow-md">
                  <img
                    src={item.image}
                    alt={`Photo of ${item.city}`}
                    className="object-cover w-full h-[30rem] transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </figure>
                <h3 className="text-center text-xl font-semibold mt-4">
                  <Link
                    to={item.link}
                    className="text-gray-800 hover:text-red-500"
                  >
                    {item.city}
                  </Link>
                </h3>
                <span className="block text-center text-red-600 mt-2">
                  <Link
                    to={item.link}
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
    </div>
  );
};

export default DiscoverRegion;
