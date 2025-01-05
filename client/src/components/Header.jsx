import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="">
      <nav className="">
        <div className="">Ikuku Property Management</div>
        <div className="">
          <Link to="/buy" className="">Buy</Link>
          <Link to="/rent" className="">Rent</Link>
          <Link to="/agent" className="">Agent</Link>
          <Link to="/region" className="">Region</Link>
          <Link to="/sell" className="">Sell</Link>
          <Link to="/service" className="">Service</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;

