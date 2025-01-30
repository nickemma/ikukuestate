import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import featuredListings from "../api/listing.json";
import Slider from "react-slick";
import { FaBed, FaBath, FaHome, FaVectorSquare, FaHeart } from "react-icons/fa";
import SimilarListing from "./SimilarListing";
import axios from "axios";
import { API_URL } from "../config/Api";
import { toast } from "react-toastify";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const listingId = parseInt(id, 10);
  const listing = featuredListings?.find((listing) => listing.id === listingId);

  const getSimilarListings = (reference, listings) => {
    return listings.filter((listing) => {
      return (
        listing?.id !== reference?.id &&
        listing?.propertyType === reference?.propertyType
      );
    });
  };

  const similarListings = getSimilarListings(listing, featuredListings);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/schedule-tour`,
        formData
      );
      if (response.status === 200) {
        toast.success("Tour scheduled successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          consent: false,
        });
      } else {
        toast.error("Failed to schedule the tour. Please try again.");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!listing) {
    return <div>Listing not found</div>;
  }

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto mt-20 p-4">
      {/* Title and Location */}
      <div className="relative flex justify-between items-center px-8 mb-8">
        <div className="mt-4">
          <h1 className="text-2xl font-bold">{listing?.name}</h1>
          <p className="text-gray-500">{listing?.location}</p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="mb-4 flex items-center justify-center gap-2">
            {/* Heart Icon */}
            <button className="flex items-center">
              <FaHeart
                className={`w-4 h-4 ${"text-red-600"}`}
                aria-label={"Remove from favorites Add to favorites"}
              />
            </button>
            <p className="text-[1rem] font-medium text-red-600">Save Listing</p>
          </div>
          <p className="text-xl font-medium text-red-600">
            ₦{listing?.price?.toLocaleString()}
          </p>
          {/* handler favorites here */}
        </div>
      </div>

      {/* Image Carousel */}
      <section className="mb-8">
        <Slider {...sliderSettings}>
          {listing.images.map((image, index) => (
            <div key={index} className="px-4">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="h-[35rem] w-full object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </Slider>
      </section>

      {/* Flex Container for Description and Schedule Form */}
      <div className="flex flex-col md:flex-row mb-8">
        {/* Description and Features */}
        <div className="mb-8 px-8 md:w-1/2">
          <div className="flex flex-wrap justify-start mb-8">
            <span className="flex items-center m-3">
              <FaBed className="mr-1 text-3xl" />
              <b className="text-lg">{listing?.beds}</b>
              <span className="ml-1 text-gray-700">Beds</span>
            </span>
            <span className="flex items-center m-3">
              <FaBath className="mr-1 text-3xl" />
              <b className="text-lg">{listing?.baths}</b>
              <span className="ml-1 text-gray-700">Baths</span>
            </span>
            <span className="flex items-center m-3">
              <FaVectorSquare className="mr-1 text-3xl" />
              <b className="text-lg">{listing?.sqft.toLocaleString()}</b>
              <span className="ml-1 text-gray-700">Sqft.</span>
            </span>
            <span className="flex items-center m-3">
              <FaHome className="mr-1 text-3xl" />
              <b className="text-lg">{listing?.propertyType}</b>
              <span className="ml-1 text-gray-700">Type</span>
            </span>
          </div>

          <h2 className="text-xl text-red-600 font-semibold mb-4">
            Property Description
          </h2>
          <p className="text-gray-700 mb-4">{listing?.description}</p>
          <h2 className="text-xl text-red-600 font-semibold mb-4">
            Property Details
          </h2>
          <p className="text-gray-700 mb-4">{listing?.propertyDetails}</p>

          <h3 className="text-lg font-semibold mb-2 text-red-600">
            Property Features
          </h3>
          <p>{listing?.features}</p>
        </div>

        {/* Schedule a Tour Form */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Schedule a Property Tour
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0 ${
                  formData.firstName ? "pt-6" : ""
                }`}
                placeholder=" "
              />
              <label
                className={`absolute left-0 top-2 text-gray-500 transition-all duration-300 ${
                  formData.firstName ? "text-sm" : "text-base"
                }`}
              >
                First Name
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0 ${
                  formData.lastName ? "pt-6" : ""
                }`}
                placeholder=" "
              />
              <label
                className={`absolute left-0 top-2 text-gray-500 transition-all duration-300 ${
                  formData.lastName ? "text-sm" : "text-base"
                }`}
              >
                Last Name
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0 ${
                  formData.email ? "pt-6" : ""
                }`}
                placeholder=" "
              />
              <label
                className={`absolute left-0 top-2 text-gray-500 transition-all duration-300 ${
                  formData.email ? "text-sm" : "text-base"
                }`}
              >
                Email
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0 ${
                  formData.phone ? "pt-6" : ""
                }`}
                placeholder=" "
              />
              <label
                className={`absolute left-0 top-2 text-gray-500 transition-all duration-300 ${
                  formData.phone ? "text-sm" : "text-base"
                }`}
              >
                Phone Number(optional)
              </label>
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Additional Notes"
              style={{ height: "50px" }}
              className="border-b border-gray-300 py-2 focus:outline-none focus:ring-0"
              rows="4"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label className="text-gray-700 text-sm">
                By submitting your information, you consent to receive
                marketing/promotional content by email, SMS, and/or phone.
                Message and data rates may apply. You may opt out at any time
                per our{" "}
                <Link to="privacy">
                  {" "}
                  <span className="text-red-500">Privacy Policy</span>
                </Link>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-red-600 text-white rounded py-2 px-4 self-start ${
                loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Submitting..." : "Schedule Tour"}
            </button>
          </form>
        </div>
      </div>
      {/* similar listing */}
      <SimilarListing similarListings={similarListings} />
    </div>
  );
};

export default ListingDetailsPage;
