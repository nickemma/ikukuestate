import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onCollapseToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div
        className={`flex-1 p-6 ${
          isSidebarCollapsed ? "ml-16" : "w-16 md:w-44"
        } transition-all duration-300`}
      >
        <main className="mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
