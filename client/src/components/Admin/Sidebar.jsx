import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-500">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        <ul>
          <li>
            <Link
              to="/admin/dashboard"
              className="block py-2 px-4 hover:bg-gray-200"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/properties"
              className="block py-2 px-4 hover:bg-gray-200"
            >
              Properties
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="block py-2 px-4 hover:bg-gray-200"
            >
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
