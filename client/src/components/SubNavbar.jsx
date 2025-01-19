import React from 'react';

export default function SubNavbar() {
  return (
    <nav className="p-4 bg-gray-200">
      <ul className="flex space-x-4">
        <li><a href="/feature-listing">Featured Listing</a></li>
        <li><a href="/agents">Agents</a></li>
        <li><a href="/offices">Offices</a></li>
      </ul>
    </nav>
  );
}
