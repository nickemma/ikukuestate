import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/Api";
import { useNavigate } from "react-router-dom";
import "../../media.css";

const CreateRegions = () => {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!city || !image) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("city", city);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      const response = await axios.post(`${API_URL}/admin/regions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setSuccess(response.data.message);
      navigate("/admin/regions");
      setCity("");
      setImage(null);
      setImagePreview("");
    } catch (error) {
      console.error(error);
      setError("Error creating region."); // Handle error
    }
  };

  return (
    <div className="responsive-container max-w-full mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create a New Region
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="city"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`mt-1 block w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              !city ? "border-red-500" : ""
            }`}
            placeholder="Enter city name" // Placeholder for better user experience
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
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
          className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition duration-200"
        >
          Create Region
        </button>
      </form>
    </div>
  );
};

export default CreateRegions;
