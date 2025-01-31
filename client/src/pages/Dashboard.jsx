import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MyProfile from "../components/MyProfile";
import FavoriteListings from "../components/FavoriteListings";

const Dashboard = () => {
  const { user } = useAuth();
  const [active, setActive] = useState(1);

  const onHandledToggle = (index) => {
    setActive(index);
  };

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

      {/* My Profile & Favorite Listings Section */}
      <section>
        <div className="mt-10">
          <ul className="flex justify-center space-x-10">
            <li
              onClick={() => onHandledToggle(1)}
              className={`text-2xl cursor-pointer border-b-2 ${
                active === 1 ? "text-5ed-400 border-red-500" : "text-black"
              } transition duration-300`}
            >
              My Profile
            </li>
            <li
              onClick={() => onHandledToggle(2)}
              className={`text-2xl cursor-pointer border-b-2 ${
                active === 2 ? "text-red-500 border-red-500" : "text-black"
              } transition duration-300`}
            >
              Favorite Listings
            </li>
          </ul>
        </div>

        {/* Content here */}
        <div className={`${active === 1 ? "flex" : "hidden"} flex-col pb-8`}>
          <MyProfile />
        </div>

        <div className={`${active === 2 ? "flex" : "hidden"} pb-8`}>
          <FavoriteListings />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
