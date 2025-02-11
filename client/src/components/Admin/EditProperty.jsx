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
    propertyType: "House",
    price: "",
    sqft: "",
    region: "",
    // House-specific fields
    beds: "",
    baths: "",
    furnished: "",
    propertyDetails: "",
    features: "",
    images: [],
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regions, setRegions] = useState([]);
  const [currentRegion, setCurrentRegion] = useState("");

  // Fetch property and regions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, regionsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/properties/${id}`),
          axios.get(`${API_URL}/admin/regions`),
        ]);

        const property = propertyRes.data;
        setCurrentRegion(property.region?.city || "");

        setFormData({
          name: property.name,
          description: property.description,
          location: property.location,
          propertyType: property.propertyType,
          price: property.price,
          sqft: property.sqft,
          region: property.region?._id || "",
          beds: property.beds || "",
          baths: property.baths || "",
          furnished: property.furnished ? "Yes" : "No",
          propertyDetails: property.propertyDetails || "",
          features: property.features || "",
          images: property.images,
        });

        setImagePreviews(property.images);
        setRegions(regionsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load property data");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "propertyType") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(value === "Land" && {
          beds: "",
          baths: "",
          furnished: "",
          propertyDetails: "",
          features: "",
        }),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setUploadedImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previewUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Common validation
    const commonFieldsValid =
      formData.name &&
      formData.description &&
      formData.location &&
      formData.price &&
      formData.sqft &&
      formData.region;

    // House-specific validation
    const houseFieldsValid =
      formData.propertyType === "House"
        ? formData.beds &&
          formData.baths &&
          formData.furnished &&
          formData.propertyDetails &&
          formData.features
        : true;

    if (!commonFieldsValid || !houseFieldsValid) {
      setError(
        `Please fill all required ${
          formData.propertyType === "House" ? "house" : "land"
        } fields`
      );
      return;
    }

    const payload = new FormData();
    // Common fields
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("location", formData.location);
    payload.append("propertyType", formData.propertyType);
    payload.append("price", formData.price);
    payload.append("sqft", formData.sqft);
    payload.append("region", formData.region);
    uploadedImages.forEach((file) => payload.append("images", file));

    // House-specific fields
    if (formData.propertyType === "House") {
      payload.append("beds", formData.beds);
      payload.append("baths", formData.baths);
      payload.append("furnished", formData.furnished === "Yes");
      payload.append("propertyDetails", formData.propertyDetails);
      payload.append("features", formData.features);
    }

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
      setTimeout(() => navigate("/admin/properties"), 1500);
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Failed to update property");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="House">House</option>
            <option value="Land">Land</option>
          </select>
        </div>

        {/* Common Fields */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="sqft"
              placeholder="Square Feet"
              value={formData.sqft}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* House-Specific Fields */}
        {formData.propertyType === "House" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="beds"
                placeholder="Bedrooms"
                value={formData.beds}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="baths"
                placeholder="Bathrooms"
                value={formData.baths}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <select
              name="furnished"
              value={formData.furnished}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Furnished?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <input
              type="text"
              name="propertyDetails"
              placeholder="Property Details"
              value={formData.propertyDetails}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="text"
              name="features"
              placeholder="Features (comma separated)"
              value={formData.features}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        {/* Region Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region (Current: {currentRegion})
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region._id} value={region._id}>
                {region.city}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add More Images (Max 5)
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Update Property
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
