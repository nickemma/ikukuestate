import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  // Sample data for charts
  const propertiesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Properties Added",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const userRegionsData = {
    labels: ["Region 1", "Region 2", "Region 3", "Region 4", "Region 5"],
    datasets: [
      {
        label: "Users by Region",
        data: [300, 250, 400, 200, 150],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="mt-6 p-4 sm:ml-16">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-gray-600 text-lg">Total Properties</h2>
          <p className="text-2xl font-bold">150</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-gray-600 text-lg">Total Users</h2>
          <p className="text-2xl font-bold">1200</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-gray-600 text-lg">Total Regions</h2>
          <p className="text-2xl font-bold">10</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-gray-600 text-lg mb-4">
            Properties Added (Last 6 Months)
          </h2>
          <Bar data={propertiesData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-gray-600 text-lg mb-4">Users by Region</h2>
          <Pie data={userRegionsData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
