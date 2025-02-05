import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/Api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditProperty = () => {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    propertyType: "",
    price: "",
    propertyDetails: "",
    beds: "",
    baths: "",
    sqft: "",
    furnished: "",
    features: "",
    region: "",
    images: [],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regions, setRegions] = useState([]); // Fetch regions for the dropdown

  // Fetch property details and regions
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/properties/${id}`);
        const {
          name,
          description,
          location,
          propertyType,
          price,
          propertyDetails,
          beds,
          baths,
          sqft,
          furnished,
          features,
          region,
          images,
        } = response.data;
        setFormData({
          name,
          description,
          location,
          propertyType,
          price,
          propertyDetails,
          beds,
          baths,
          sqft,
          furnished,
          features,
          region,
          images,
        });
        setImagePreviews(images);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        setError("Failed to fetch property. Please try again.");
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/regions`);
        setRegions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      }
    };

    fetchProperty();
    fetchRegions();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
    setUploadedImages(files);

    // Generate preview URLs for the uploaded files
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previewUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prepare form data for submission
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("location", formData.location);
    payload.append("propertyType", formData.propertyType);
    payload.append("price", formData.price);
    payload.append("propertyDetails", formData.propertyDetails);
    payload.append("beds", formData.beds);
    payload.append("baths", formData.baths);
    payload.append("sqft", formData.sqft);
    payload.append("furnished", formData.furnished);
    payload.append("features", formData.features);
    payload.append("region", formData.region);
    uploadedImages.forEach((file) => payload.append("images", file)); // Append new images

    try {
      const response = await axios.put(
        `${API_URL}/admin/properties/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccess(response.data.message);
      navigate("/admin/properties");
    } catch (error) {
      console.error("Failed to update property:", error);
      setError("Failed to update property. Please try again.");
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md w-full md:w-[40rem]">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}

        {/* Name */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter property name"
          />
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter property description"
          />
        </div>

        {/* Location */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="location"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter property location"
          />
        </div>

        {/* Property Type */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="propertyType"
          >
            Property Type
          </label>
          <input
            type="text"
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter property location"
          />
        </div>
        {/* Price */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="price"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter property price"
          />
        </div>

        {/* Property Details */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="propertyDetails"
          >
            Property Details
          </label>
          <input
            type="text"
            id="propertyDetails"
            name="propertyDetails"
            value={formData.propertyDetails}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter property details"
          />
        </div>

        {/* Beds */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="beds"
          >
            Beds
          </label>
          <input
            type="number"
            id="beds"
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter number of beds"
          />
        </div>

        {/* Baths */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="baths"
          >
            Baths
          </label>
          <input
            type="number"
            id="baths"
            name="baths"
            value={formData.baths}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter number of baths"
          />
        </div>

        {/* Sqft */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="sqft"
          >
            Square Feet
          </label>
          <input
            type="number"
            id="sqft"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter square feet"
          />
        </div>

        {/* Furnished */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="furnished"
          >
            Furnished
          </label>
          <select
            id="furnished"
            name="furnished"
            value={formData.furnished}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
          >
            <option value="">Select furnished status</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Features */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="features"
          >
            Features (comma separated)
          </label>
          <input
            type="text"
            id="features"
            name="features"
            value={formData.features}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
            placeholder="Enter features (e.g., Pool, Gym)"
          />
        </div>

        {/* Region */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="region"
          >
            Region
          </label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="mt-1 block w-full outline-none rounded-md p-2 shadow-sm"
          >
            <option value="">Select region</option>
            {regions.map((region) => (
              <option key={region._id} value={region._id}>
                {region.city}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div>
          <label
            className="block text-lg sm:text-xl font-medium text-gray-700"
            htmlFor="images"
          >
            Images
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <div className="mt-2 flex flex-wrap gap-4">
            {imagePreviews.map((previewUrl, index) => (
              <img
                key={index}
                src={previewUrl}
                alt={`Preview ${index}`}
                className="h-32 w-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold p-2 sm:p-3 rounded-md hover:bg-red-700 transition duration-200"
        >
          Update Property
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
