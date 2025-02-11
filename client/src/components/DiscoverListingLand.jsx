import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/Api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const DiscoverListingLand = () => {
  const [visibleListings, setVisibleListings] = useState(6);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoadMore = () => {
    setVisibleListings((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/properties/lands`);
        setProperties(response.data);
      } catch (err) {
        setError("Failed to load lands", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="py-10">
      {/* Featured Houses Header */}
      <div className="text-center mb-10">
        <div className="mb-4">
          <h2 className="text-2xl text-red-500">FEATURED LANDS</h2>
          <h3 className="text-2xl font-medium italic">
            We&apos;ll find the land, you&apos;ll build the stories
          </h3>
        </div>
        <Link to="/properties">
          <button className="h-10 bg-red-600 px-6 text-white text-xl rounded-md">
            Discover Lands
          </button>
        </Link>
      </div>

      {/* Houses Section */}
      {properties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-xl">
            No lands available at the moment
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-12">
            {properties.slice(0, visibleListings).map((house) => (
              <article
                key={house._id}
                className="bg-gray-200 rounded-md shadow-sm overflow-hidden cursor-pointer"
              >
                <Link to={`/properties/${house._id}`}>
                  <figure className="overflow-hidden">
                    <img
                      src={house?.images?.[0] || "/placeholder-house.jpg"}
                      alt={house.name}
                      className="w-full h-64 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </figure>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{house.name}</h3>
                      <p className="text-sm font-medium text-red-600">
                        ₦{house.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{house.location}</p>
                      <p>
                        {house.beds} beds | {house.baths} baths | {house.sqft}{" "}
                        sqft
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {visibleListings < properties.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="h-10 bg-red-600 px-6 text-white text-xl rounded-md"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default DiscoverListingLand;
