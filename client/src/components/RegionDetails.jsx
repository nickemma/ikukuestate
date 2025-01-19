import { useParams } from "react-router-dom";
import region from "../api/region.json";
import DiscoverListing from "./DiscoverListing";

const RegionDetails = () => {
  const { regionId } = useParams();

  // Find the region based on the ID or path parameter
  const selectedRegion = region?.find((item) => item?.link?.includes(regionId));

  if (!selectedRegion) {
    return <h2 className="text-center mt-20">Region not found!</h2>;
  }

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

      <DiscoverListing />
    </div>
  );
};

export default RegionDetails;
