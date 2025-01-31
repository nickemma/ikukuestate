const AdminDashboard = () => {
  return (
    <div className="mt-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-gray-600">Total Properties</h2>
          <p className="text-2xl font-bold">150</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-gray-600">Total Users</h2>
          <p className="text-2xl font-bold">1200</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-gray-600">Appointments</h2>
          <p className="text-2xl font-bold">45</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
