import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="">
      <nav className="fixed top-0 left-0 z-10 flex items-center justify-between w-full px-6 text-lg font-bold bg-white border-2 border-red-200 border-2transparent h-100vh">
    <div className='w-40 bg-red-600 h-[7rem]'>LOGO</div>
        <div className="space-x-8 ">
          <Link to="/buy" className="">BUY</Link>
          <Link to="/rent" className="">RENT</Link>
          <Link to="/agent" className="">AGENT</Link>
          <Link to="/region" className="">REGION</Link>
          <Link to="/sell" className="">SELL</Link>
          <Link to="/service" className="">SERVICE</Link>
          <button className='w-56 h-10 bg-red-600'>SIGN IN / SIGN UP</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;

