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
import AdminLayout from "./components/Admin/AdminLayout";
import EditRegion from "./components/Admin/EditRegion";
import EditProperty from "./components/Admin/EditProperty";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/Properties";
import AdminUsers from "./pages/admin/Users";
import CreateRegions from "./pages/admin/CreateRegions";
import CreateProperty from "./pages/admin/CreateProperty";
import Regions from "./pages/admin/Regions";

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
              <ProtectedRoute requiredRole="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="region" element={<CreateRegions />} />
            <Route path="create" element={<CreateProperty />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="regions" element={<Regions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="/admin/regions/edit/:id" element={<EditRegion />} />
            <Route
              path="/admin/properties/edit/:id"
              element={<EditProperty />}
            />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
