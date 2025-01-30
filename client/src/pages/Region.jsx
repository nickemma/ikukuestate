import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/Api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useEffect, useState } from "react";

const Region = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/regions`);
        setRegions(response.data.data);
      } catch (err) {
        setError("Failed to load regions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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
        {regions.map((item) => (
          <div
            key={item._id}
            className="bg-gray-200 rounded-md shadow-sm overflow-hidden cursor-pointer"
          >
            <Link to={`/region/${item._id}`}>
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
    </section>
  );
};

export default Region;
