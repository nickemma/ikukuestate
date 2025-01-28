import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Region from "./pages/Region";
import RegionDetails from "./components/RegionDetails";
import ListingDetailsPage from "./components/ListingDetailsPage";
import Sell from "./pages/Sell";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermOfUse from "./pages/TermOfUse";
import Buy from "./pages/Buy";

import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerification from "./components/EmailVerification";

// Admin Routes
// import AdminLayout from "./components/Admin/AdminLayout";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminProperties from "./pages/admin/Properties";
// import AdminUsers from "./pages/admin/Users";

const App = () => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/region" element={<Region />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Buy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermOfUse />} />
          <Route path="/region/:regionId" element={<RegionDetails />} />
          <Route path="/properties/:id" element={<ListingDetailsPage />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="users" element={<AdminUsers />} />
          </Route> */}
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
