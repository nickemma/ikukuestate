import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import { FaHeart } from "react-icons/fa";

const FavoriteListings = () => {
  const { state, addFavorite, removeFavorite } = useFavorites();
  const { favorites } = state;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {favorites && favorites.length > 0 ? (
          favorites.map((listing) => {
            const isFavorite = favorites.some((fav) => fav._id === listing._id);

            const handleFavoriteClick = async (e) => {
              e.preventDefault(); // Prevent the Link from navigating
              e.stopPropagation(); // Stop event propagation

              if (isFavorite) {
                await removeFavorite(listing._id); // Remove from favorites
              } else {
                await addFavorite(listing); // Add to favorites
              }
            };

            return (
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
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 mt-1">
                        {listing?.location}
                      </p>
                      <div className="flex justify-center items-center w-10 h-10 bg-gray-200 border border-gray-300 rounded-md p-1">
                        <FaHeart
                          onClick={handleFavoriteClick}
                          className={`w-6 h-6 ${
                            isFavorite ? "text-red-600" : "text-gray-400"
                          }`}
                          aria-label={
                            isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })
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
