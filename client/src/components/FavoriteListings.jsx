import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";

import LoadingSpinner from "./LoadingSpinner";

const FavoriteListings = () => {
  const { state } = useFavorites();
  const { favorites, loading } = state;

  if (loading) return <LoadingSpinner />;

  const favoriteListings = favorites?.favorites; // Extract the favorites array

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {favoriteListings && favoriteListings.length > 0 ? (
          favoriteListings.map((listing) => (
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
          ))
        ) : (
          <p className="text-center text-gray-500">
            No favorite listings available.
          </p>
        )}
      </div>
    </section>
  );
};

export default FavoriteListings;
