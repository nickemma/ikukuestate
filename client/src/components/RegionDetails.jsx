import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import PropertiesByRegion from "./PropertiesByRegion";
import { useEffect, useState } from "react";
import { API_URL } from "../config/Api";

const RegionDetails = () => {
  const { regionId } = useParams();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/admin/regions/${regionId}`
        );
        setSelectedRegion(response.data.data);
      } catch (err) {
        setError("Failed to load region", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegion();
  }, [regionId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedRegion)
    return <h2 className="text-center mt-20">Region not found!</h2>;

  return (
    <div className="mt-20">
      <div className="relative flex justify-center items-center">
        <img
          src={selectedRegion?.image}
          alt={`Photo of ${selectedRegion?.city}`}
          className="shadow-lg w-full h-[40rem] object-cover"
          loading="lazy"
          title={selectedRegion?.city}
        />
        {/* Text overlay - Top left */}
        <h1 className="absolute top-8 left-8 text-white text-3xl font-bold px-4 py-2">
          {selectedRegion?.city}
        </h1>
      </div>

      <PropertiesByRegion />
    </div>
  );
};

export default RegionDetails;
