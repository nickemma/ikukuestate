import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CreateRegions = () => {
  const { accessToken } = useAuth();
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
      const response = await axios.post(`${API_URL}/admin/regions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`, // Include token in headers
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
    <div className="max-w-full mx-auto p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md w-full md:w-[40rem]">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create a New Region
      </h1>
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
          className="text-xl flex items-center mx-auto mb-12 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Create Region
        </button>
      </form>
    </div>
  );
};

export default CreateRegions;
