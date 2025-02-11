import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/Api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { useAuth } from "../../context/AuthContext";

const Properties = () => {
  const { accessToken } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/properties`);
        setProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setError("Failed to fetch properties. Please try again.");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle delete property
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`${API_URL}/admin/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Remove the deleted property from the state
        setProperties(properties.filter((property) => property._id !== id));
      } catch (error) {
        console.error("Failed to delete property:", error);
        setError("Failed to delete property. Please try again.");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="sm:p-6 sm:ml-16 ">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {properties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
          >
            <div className="relative h-48">
              <img
                src={property.images[0]} // Display the first image
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Link
                  to={`/admin/properties/edit/${property._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit className="text-xl" />
                </Link>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <p className="text-gray-600 mb-2">
                {property.beds} Beds, {property.baths} Baths, {property.sqft}{" "}
                sqft
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;
