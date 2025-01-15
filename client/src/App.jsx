import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rent from './pages/Rent';
import Agents from './pages/Agents';
import Region from './pages/Region';
import Service from './pages/Service';
// import buy from './pages/Buy';
import Signup from './pages/Signup';



const App = () => {
  return (  
    <Router>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} /> 
          {/* <Route path="/buy" element={<Buy />} /> */}
          <Route path="/rent" element={<Rent />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/region" element={<Region />} />
          {/* <Route path="/sell" element={<Sell />} /> */}
          <Route path="/service" element={<Service />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;



