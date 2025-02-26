import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoriteContext";

const SimilarListing = ({ similarProperties }) => {
  const { state, addFavorite, removeFavorite } = useFavorites();

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h2 className="text-2xl text-red-500">SIMILAR LISTINGS</h2>
        <h3 className="text-2xl font-medium italic">
          You might also like these listings
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {similarProperties?.map((listing) => {
          const isFavorite = state.favorites.some(
            (fav) => fav._id === listing._id
          );

          const handleFavoriteClick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isFavorite) {
              await removeFavorite(listing._id);
            } else {
              await addFavorite(listing);
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
                  <p className="text-sm text-gray-500 mt-1">
                    {listing?.location}
                  </p>

                  {/* Conditional Rendering Based on Property Type */}
                  {listing.propertyType === "House" ? (
                    <div className="flex justify-between items-center">
                      <div className="flex flex-row space-x-4 py-2">
                        <span className="flex items-center">
                          <b className="text-lg">{listing?.beds}</b>
                          <span className="ml-1">
                            {listing?.beds > 1 ? "Beds" : "Bed"}
                          </span>
                        </span>

                        <span className="flex items-center">
                          <b className="text-lg">{listing?.baths}</b>
                          <span className="ml-1">
                            {listing?.baths > 1 ? "Baths" : "Bath"}
                          </span>
                        </span>

                        <span className="flex items-center">
                          <b className="text-lg">
                            {listing?.sqft.toLocaleString()}
                          </b>
                          <span className="ml-1">SQFT</span>
                        </span>
                      </div>
                    </div>
                  ) : listing.propertyType === "Land" ? (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <b className="text-lg">
                          {listing?.sqft.toLocaleString()}
                        </b>
                        <span className="ml-1">SQFT</span>
                      </span>
                      <p>
                        <b>{listing?.propertyType}</b>
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-4">
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
        })}
      </div>
    </section>
  );
};

SimilarListing.propTypes = {
  similarProperties: PropTypes.arrayOf(
    PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      beds: PropTypes.number,
      baths: PropTypes.number,
      sqft: PropTypes.number.isRequired,
      propertyType: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SimilarListing;
