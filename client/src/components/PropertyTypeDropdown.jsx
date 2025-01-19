import { useState } from "react";
import PropTypes from "prop-types";

const PropertyTypeDropdown = ({ uniquePropertyTypes, filters, setFilters }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prevFilters) => {
      const selectedTypes = prevFilters.propertyType || [];
      if (checked) {
        return { ...prevFilters, propertyType: [...selectedTypes, value] };
      } else {
        return {
          ...prevFilters,
          propertyType: selectedTypes.filter((type) => type !== value),
        };
      }
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="border rounded px-4 py-2 bg-white "
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        Property Types
      </button>
      {isDropdownOpen && (
        <div className="absolute bg-white border rounded shadow-md mt-2 w-48 z-10">
          <div className="flex flex-col p-2 max-h-48 overflow-y-auto">
            {uniquePropertyTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  value={type}
                  checked={filters.propertyType.includes(type)}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-1">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
PropertyTypeDropdown.propTypes = {
  uniquePropertyTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.shape({
    propertyType: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default PropertyTypeDropdown;
