import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SimilarListing = ({ similarListings }) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h2 className="text-2xl text-red-500">SIMILAR LISTINGS</h2>
        <h3 className="text-2xl font-medium italic">
          You might also like these listings
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {similarListings?.map((listing) => (
          <article
            key={listing?.id}
            className="bg-gray-200 rounded-md shadow-sm overflow-hidden cursor-pointer"
          >
            <Link to={`/properties/${listing.id}`}>
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
                  <p>
                    <b>{listing?.propertyType}</b>
                  </p>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
SimilarListing.propTypes = {
  similarListings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      beds: PropTypes.number.isRequired,
      baths: PropTypes.number.isRequired,
      sqft: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SimilarListing;
