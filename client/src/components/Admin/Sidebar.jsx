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
      className={`fixed ${
        isCollapsed
          ? "bottom-0 left-0 right-0 h-16 md:left-0 md:top-0 md:h-full md:w-16"
          : "bottom-0 left-0 right-0 h-16 md:left-0 md:top-0 md:h-full md:w-44"
      } bg-white shadow-lg transition-all duration-300 ease-in-out`}
    >
      {/* Toggle Button */}
      <div
        className="flex items-center justify-center md:p-4 p-0 cursor-pointer md:justify-between"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <AiOutlineMenu className="text-2xl" />
        ) : (
          <AiOutlineClose className="text-2xl" />
        )}
      </div>
      {/* Navigation */}
      <nav className="mt-2 md:mt-10">
        <ul className="flex justify-around md:block">
          <li>
            <Link
              to="/admin/dashboard"
              className="flex flex-col items-center p-2 hover:bg-gray-200 md:flex-row md:py-2 md:px-4"
            >
              <FaTachometerAlt className="text-xl" />
              {!isCollapsed && (
                <span className="mt-1 text-xs md:ml-2 md:mt-0 md:text-base">
                  Dashboard
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/properties"
              className="flex flex-col items-center p-2 hover:bg-gray-200 md:flex-row md:py-2 md:px-4"
            >
              <FaHome className="text-xl" />
              {!isCollapsed && (
                <span className="mt-1 text-xs md:ml-2 md:mt-0 md:text-base">
                  Properties
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/region"
              className="flex flex-col items-center p-2 hover:bg-gray-200 md:flex-row md:py-2 md:px-4"
            >
              <IoAdd className="text-xl" />
              {!isCollapsed && (
                <span className="mt-1 text-xs md:ml-2 md:mt-0 md:text-base">
                  Create Region
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/create"
              className="flex flex-col items-center p-2 hover:bg-gray-200 md:flex-row md:py-2 md:px-4"
            >
              <MdOutlineCreateNewFolder className="text-xl" />
              {!isCollapsed && (
                <span className="mt-1 text-xs md:ml-2 md:mt-0 md:text-base">
                  Create Property
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/regions"
              className="flex flex-col items-center p-2 hover:bg-gray-200 md:flex-row md:py-2 md:px-4"
            >
              <GiWorld className="text-xl" />
              {!isCollapsed && (
                <span className="mt-1 text-xs md:ml-2 md:mt-0 md:text-base">
                  Regions
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="flex flex-col items-center p-2 hover:bg-gray-200 md:flex-row md:py-2 md:px-4"
            >
              <FaUsers className="text-xl" />
              {!isCollapsed && (
                <span className="mt-1 text-xs md:ml-2 md:mt-0 md:text-base">
                  Users
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
