import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 mt-24">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Welcome {user.firstName} {user.lastName}
      </h1>

      <div className="bg-gray-100 p-6 rounded-md">
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            Welcome to your Listing Alert account. Here you can view/edit saved
            searches as well as properties you have saved as favorites. You will
            be notified by email when any new properties come on the market,
            there are price or status changes, or when there are upcoming open
            houses for properties that fit your criteria.
          </p>
          <p className="text-gray-700 mb-4">
            Please click <b>Start a New Search Now</b> to continue looking for
            more homes. You can save new searches at any time and/or click the
            heart button to save any listings as favorites. Please contact your
            realtor if you have any questions.
          </p>
          <Link
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all"
            to="/properties"
          >
            Start a New Search Now
          </Link>
        </div>
      </div>

      {/* My Profile Section */}
      <div className="bg-white shadow-md rounded-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
        <p className="text-gray-700">
          <b>Name:</b> {user.firstName} {user.lastName}
        </p>
        <p className="text-gray-700">
          <b>Email:</b> {user.email}
        </p>
        <Link
          className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all"
          to="/profile"
        >
          Edit Profile
        </Link>
      </div>

      {/* Favorite Listings Section */}
      <div className="bg-white shadow-md rounded-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Favorite Listings</h2>
        <p className="text-gray-700 mb-4">
          View all your saved properties here.
        </p>
        <Link
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all"
          to="/favorites"
        >
          View Favorites
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
