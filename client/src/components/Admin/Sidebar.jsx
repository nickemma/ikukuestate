import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaHome, FaUsers } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { GiWorld } from "react-icons/gi";
import { IoAdd } from "react-icons/io5";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-16 md:w-44" // Use w-16 for mobile and w-44 for larger screens
      }`}
    >
      {/* Toggle Button */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <AiOutlineMenu className="text-2xl" />
        ) : (
          <AiOutlineClose className="text-2xl" />
        )}
      </div>
      {/* Navigation */}
      <nav className="mt-10">
        <ul>
          <li>
            <Link
              to="/admin/dashboard"
              className="flex items-center py-2 px-4 hover:bg-gray-200"
            >
              <FaTachometerAlt className="text-xl" />
              {!isCollapsed && (
                <span className="ml-2 hidden md:inline">Dashboard</span> // Hidden on mobile
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/properties"
              className="flex items-center py-2 px-4 hover:bg-gray-200"
            >
              <FaHome className="text-xl" />
              {!isCollapsed && (
                <span className="ml-2 hidden md:inline">Properties</span> // Hidden on mobile
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/region"
              className="flex items-center py-2 px-4 hover:bg-gray-200"
            >
              <IoAdd className="text-xl" />
              {!isCollapsed && (
                <span className="ml-2 hidden md:inline">Create Region</span> // Hidden on mobile
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/create"
              className="flex items-center py-2 px-4 hover:bg-gray-200"
            >
              <MdOutlineCreateNewFolder className="text-xl" />
              {!isCollapsed && (
                <span className="ml-2 hidden md:inline">Create Property</span> // Hidden on mobile
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/regions"
              className="flex items-center py-2 px-4 hover:bg-gray-200"
            >
              <GiWorld className="text-xl" />
              {!isCollapsed && (
                <span className="ml-2 hidden md:inline">Regions</span> // Hidden on mobile
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="flex items-center py-2 px-4 hover:bg-gray-200"
            >
              <FaUsers className="text-xl" />
              {!isCollapsed && (
                <span className="ml-2 hidden md:inline">Users</span> // Hidden on mobile
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
