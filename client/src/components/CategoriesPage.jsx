import React from 'react';
import SubNavbar from './SubNavbar'; 
import { useParams } from 'react-router-dom';

export default function CategoriesPage() {
  const { state } = useParams();
  console.log('RegionPage rendered');
  console.log('State parameter:', state);

  return (
    <div>
      <SubNavbar /> 
      <h1>Region Detail Page</h1>
      <p>State: {state}</p>
    </div>
  );
}
