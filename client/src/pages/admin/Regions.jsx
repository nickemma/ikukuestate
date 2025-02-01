import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/Api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const Regions = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/regions`);
        setRegions(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
        setError("Failed to fetch regions. Please try again.");
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Handle delete region
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this region?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/admin/regions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the deleted region from the state
        setRegions(regions.filter((region) => region._id !== id));
      } catch (error) {
        console.error("Failed to delete region:", error);
        setError("Failed to delete region. Please try again.");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-4 sm:p-6 sm:ml-16">
      <h1 className="text-2xl font-bold mb-4">Regions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {regions.map((region) => (
          <div
            key={region._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={region.image}
              alt={region.city}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{region.city}</h2>
              <div className="flex justify-end space-x-2">
                <Link
                  to={`/admin/regions/edit/${region._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit className="text-xl" />
                </Link>
                <button
                  onClick={() => handleDelete(region._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Regions;
