import { Link } from "react-router-dom";
import region from "../api/region.json";
import DiscoverListing from "../components/DiscoverListing";

const Region = () => {
  return (
    <section className="px-6 mt-20 bg-gray-100 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">
          GLOBAL <span className="text-red-500">REGIONS</span>
        </h1>
        <h2 className="text-xl italic mt-4">
          Wherever you&apos;re going, <em>we can take you there.</em>
        </h2>
      </div>

      {/* Region Grid */}
      <h3 className="text-2xl font-medium mb-4 px-12">Nigeria</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-12">
        {region.map((item) => (
          <div
            key={item.id}
            className="bg-gray-200 rounded-md shadow-sm overflow-hidden cursor-pointer"
          >
            <Link to={item.link}>
              <figure className="overflow-hidden">
                <img
                  src={item.image}
                  alt={`Photo of ${item.city}`}
                  className="w-full h-60 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </figure>
              <div className="p-4">
                <h3 className="text-[1.2rem] font-semibold">{item.city}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <DiscoverListing />
    </section>
  );
};

export default Region;
