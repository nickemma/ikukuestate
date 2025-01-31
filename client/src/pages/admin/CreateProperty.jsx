import { useState } from "react";
import axios from "axios";

const CreateProperty = () => {
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
    region: "",
    furnished: false,
    features: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => form.append(key, file));
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post("/api/admin/properties", form);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Create New Property</h2>
      {loading && <p>Loading...</p>}
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        {[
          "name",
          "description",
          "location",
          "propertyType",
          "price",
          "propertyDetails",
          "beds",
          "baths",
          "sqft",
          "region",
          "features",
        ].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium mb-1">{field}</label>
            <input
              type={
                field === "price" ||
                field === "beds" ||
                field === "baths" ||
                field === "sqft"
                  ? "number"
                  : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Furnished</label>
          <input
            type="checkbox"
            name="furnished"
            checked={formData.furnished}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            required
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Create Property
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
