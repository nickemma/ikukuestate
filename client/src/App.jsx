import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RegionPage from './components/RegionPage'; // The detailed page for global regions
import CategoriesPage from './components/CategoriesPage'; // The detailed page for categories
import Home from './pages/Home';
import Rent from './pages/Rent';
import Agents from './pages/Agents';
import Region from './pages/Region';
import Service from './pages/Service';
// import buy from './pages/Buy';





const App = () => {
  return (  
    <Router>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} /> 
          {/* <Route path="/buy" element={<Buy />} /> */}
          <Route path="/rent" element={<Rent />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/region" element={<Region />} />
          {/* <Route path="/sell" element={<Sell />} /> */}
          <Route path="/service" element={<Service />} />

          {/* Detail Pages Routes */}
        <Route path="/region-page/:state" element={<RegionPage />} />
        <Route path="/categories-page/:state" element={<CategoriesPage />} />
          
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;



