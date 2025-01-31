import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/Api";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const PropertiesByRegion = () => {
  const { regionId } = useParams();
  const [visibleListings, setVisibleListings] = useState(6);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoadMore = () => {
    setVisibleListings((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/admin/properties/region/${regionId}`
        );
        setProperties(response.data);
      } catch (err) {
        setError("Failed to load regions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [regionId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="py-10">
      {/* Global Regions Header */}
      <div className="text-center mb-10">
        <div className="mb-4">
          <h2 className="text-2xl text-red-500">FEATURED LISTINGS</h2>
          <h3 className="text-2xl font-medium italic">
            We&apos;ll find the home, you&apos;ll write the stories
          </h3>
        </div>
        <Link to="/properties">
          <button className="h-10 bg-red-600 px-6 text-white text-xl rounded-md">
            Discover Listing
          </button>
        </Link>
      </div>

      {/* Listings Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-12">
        {properties?.slice(0, visibleListings)?.map((listing) => (
          <article
            key={listing?._id}
            className="bg-gray-200 rounded-md shadow-sm overflow-hidden cursor-pointer"
          >
            <Link to={`/properties/${listing._id}`}>
              <figure className="overflow-hidden">
                <img
                  src={listing?.images[0]}
                  alt={listing?.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </figure>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{listing?.name}</h3>
                  <p className="text-sm font-medium text-red-600">
                    ₦{listing?.price?.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {listing?.location}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {visibleListings < properties?.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="h-10 bg-red-600 px-6 text-white text-xl rounded-md"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default PropertiesByRegion;
