import { useEffect, useState } from "react";
import PropertyTypeDropdown from "../components/PropertyTypeDropdown";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/Api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [regions, setRegions] = useState([]); // Add regions state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    propertyType: [],
    minPrice: "",
    maxPrice: "",
    furnished: "",
    beds: "",
    baths: "",
    city: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, regionsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/properties`),
          axios.get(`${API_URL}/admin/regions`), // Fetch regions
        ]);

        setProperties(propertiesRes.data);
        setRegions(regionsRes.data.data);
      } catch (err) {
        setError("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create region ID to city map
  const regionMap = regions.reduce((acc, region) => {
    acc[region._id] = region.city;
    return acc;
  }, {});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: checked
          ? [...prevFilters[name], value]
          : prevFilters[name].filter((item) => item !== value),
      }));
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Get unique cities from regions
  const uniqueCities = Array.from(
    new Set(regions.map((region) => region.city))
  ).filter(Boolean);

  const uniquePropertyTypes = Array.from(
    new Set(properties.map((listing) => listing.propertyType))
  );

  // Filtered listings
  const filteredListings = properties.filter((listing) => {
    const listingCity = regionMap[listing.region] || "";
    const isHouse = listing.propertyType === "House";

    return (
      (filters.propertyType.length === 0 ||
        filters.propertyType.includes(listing.propertyType)) &&
      (filters.city === "" || listingCity === filters.city) &&
      (filters.minPrice === "" || listing.price >= Number(filters.minPrice)) &&
      (filters.maxPrice === "" || listing.price <= Number(filters.maxPrice)) &&
      (filters.furnished === "" ||
        (isHouse && listing.furnished === (filters.furnished === "true"))) &&
      (filters.beds === "" ||
        !isHouse ||
        listing.beds >= (filters.beds === "5" ? 5 : Number(filters.beds))) &&
      (filters.baths === "" ||
        !isHouse ||
        listing.baths >= (filters.baths === "5" ? 5 : Number(filters.baths)))
    );
  });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto p-4">
      {/* Filters */}
      <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg mb-6 mt-20">
        <h2 className="text-lg font-semibold mb-2">Explore Properties</h2>
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <PropertyTypeDropdown
            uniquePropertyTypes={uniquePropertyTypes}
            filters={filters}
            setFilters={setFilters}
          />

          <select
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="border rounded p-2 "
          >
            <option value="">Min Price</option>
            <option value="0"> ₦0+</option>
            <option value="10000"> ₦200,000+</option>
            <option value="250000"> ₦500,000+</option>
            <option value="500000"> ₦1,000,000+</option>
            <option value="1000000"> ₦1,500,000+</option>
          </select>

          <select
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="">Max Price</option>
            <option value="250000"> ₦2,000,000</option>
            <option value="500000"> ₦2,500,000</option>
            <option value="750000"> ₦5,750,000</option>
            <option value="1000000"> ₦1,000,000,000</option>
          </select>

          <select
            name="furnished"
            value={filters.furnished}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="">Any Furnishing</option>
            <option value="true">Furnished</option>
            <option value="false">Unfurnished</option>
          </select>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() =>
              setFilters({
                propertyType: [],
                minPrice: "",
                maxPrice: "",
                furnished: "",
                beds: "",
                baths: "",
                city: "",
              })
            }
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Search
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Done
          </button>
        </div>
      </div>

      {/* Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedListings.map((listing) => {
          const city = regionMap[listing.region] || "Unknown City";

          return (
            <Link key={listing._id} to={`/properties/${listing._id}`}>
              <div className="border rounded-lg shadow-md overflow-hidden">
                <img
                  src={listing.images[0]}
                  alt={listing.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{listing.name}</h3>
                  <p className="text-gray-600">{city}</p> {/* Show city name */}
                  <p className="text-gray-800 font-bold mt-2">
                    ₦{listing?.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === index + 1
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Buy;
