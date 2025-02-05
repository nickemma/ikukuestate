import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/Api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditRegion = () => {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch region details
  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/regions/${id}`);
        const { city, image } = response.data.data;
        setCity(city);
        setImagePreview(image);
      } catch (error) {
        console.error("Failed to fetch region:", error);
        setError("Failed to fetch region. Please try again.");
      }
    };

    fetchRegion();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!city || (!image && !imagePreview)) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("city", city);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(
        `${API_URL}/admin/regions/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccess(response.data.message);
      navigate("/admin/regions");
    } catch (error) {
      console.error("Failed to update region:", error);
      setError("Failed to update region. Please try again.");
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md w-full md:w-[40rem]">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Region</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="city"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`mt-1 block w-full outline-none rounded-md p-2 shadow-sm ${
              !city ? "border-red-500" : ""
            }`}
            placeholder="Enter city name"
          />
        </div>
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="image"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {imagePreview && (
            <div className="mt-2 flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold p-2 sm:p-3 rounded-md hover:bg-red-700 transition duration-200"
        >
          Update Region
        </button>
      </form>
    </div>
  );
};

export default EditRegion;
