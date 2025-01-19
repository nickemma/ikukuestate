import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.firstName}</h1>
      <button
        className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
