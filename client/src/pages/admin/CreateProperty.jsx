import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CreateProperty = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    propertyType: "",
    propertyDetails: "",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    furnished: "",
    features: "",
    region: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // Store image preview URLs
  const [regions, setRegions] = useState([]); // State to store regions

  // Fetch regions from the backend
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/regions`);
        setRegions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      }
    };

    fetchRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" ||
        name === "beds" ||
        name === "baths" ||
        name === "sqft"
          ? Number(value) // Convert to number
          : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
    setUploadedImages(files);

    // Generate preview URLs for the uploaded files
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    // Convert features to array
    const featuresArray = formData.features
      .split(",")
      .map((feature) => feature.trim());

    // Convert furnished to boolean
    const furnishedBoolean = formData.furnished === "Yes"; // "Yes" -> true, "No" -> false
    // Validate form data
    if (
      !formData.name ||
      !formData.description ||
      !formData.location ||
      !formData.propertyType ||
      !formData.propertyDetails ||
      !formData.price ||
      !formData.beds ||
      !formData.baths ||
      !formData.sqft ||
      !formData.region ||
      !featuresArray.length ||
      formData.furnished === "" ||
      uploadedImages.length === 0
    ) {
      setErrors({ message: "All fields are required" });
      return;
    }

    // Prepare form data for submission
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("location", formData.location);
    payload.append("propertyType", formData.propertyType);
    payload.append("propertyDetails", formData.propertyDetails);
    payload.append("price", formData.price);
    payload.append("beds", formData.beds);
    payload.append("baths", formData.baths);
    payload.append("sqft", formData.sqft);
    payload.append("furnished", furnishedBoolean);
    payload.append("region", formData.region);
    payload.append("features", JSON.stringify(featuresArray)); // Stringify array
    uploadedImages.forEach((file) => payload.append("images", file)); // Append images

    try {
      const response = await axios.post(
        `${API_URL}/admin/properties`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`, // Include token in headers
          },
        }
      );
      setSuccess(response.data.message);
      navigate("/admin/properties"); // Redirect to properties page
      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        location: "",
        propertyType: "",
        propertyDetails: "",
        price: "",
        beds: "",
        baths: "",
        sqft: "",
        furnished: "",
        features: "",
        region: "",
        images: [],
      });
      setUploadedImages([]);
      setImagePreviews([]); // Clear image previews
      setErrors({});
    } catch (error) {
      console.error("Error:", error.response?.data);
      setErrors({ message: "Failed to create property. Please try again." });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create New Property Listing</h1>
      {errors.message && (
        <div className="mb-4 text-red-500">{errors.message}</div>
      )}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
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
            <input
              type="text"
              name="propertyDetails"
              placeholder="Property Details"
              value={formData.propertyDetails}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Section 2: Property Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="propertyType"
              placeholder="Property Type"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
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
              name="beds"
              placeholder="Beds"
              value={formData.beds}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="baths"
              placeholder="Baths"
              value={formData.baths}
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
          </div>
        </div>

        {/* Section 3: Features and Region */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Features and Region</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="features"
              placeholder="Features (comma separated)"
              value={formData.features}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Region</option>
              {regions?.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 4: Upload Images */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
            required
          />
          <div className="mt-4 flex flex-wrap gap-4">
            {imagePreviews.map((previewUrl, index) => (
              <img
                key={index}
                src={previewUrl}
                alt={`Uploaded ${index}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-xl flex items-center mx-auto mb-12 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Create Property
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
