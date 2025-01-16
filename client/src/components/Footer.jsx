import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { TiSocialYoutubeCircular } from "react-icons/ti";
import { FaSquareInstagram } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";



export default function Footer() {
  return (

    <div className='px-6 mt-24 '>

<div className='flex gap-64 '>
<div
className='w-40 bg-red-600 h-[7rem] font-bold ml-28'>LOGO
</div>
<div>
<h1 className='font-semibold text-[1.5rem] font-serif'>The Ikukuestate</h1>
<p className=' text-[1.5rem]'>ABOUT US</p>
</div>
<div>
<h2 className='font-semibold ml-60 text-[1.5rem] font-serif'>Resouces</h2>
<ul className='outline-none text-[1.5rem]  ml-60'>
  <li>BUY</li>
  <li>RENT</li>
  <li>SELL</li>
  <li>REGIONS</li>
</ul>
</div>

</div>

<hr className='bg-gray-950'></hr>
<h3 className='text-[1.5rem] ml-28'>THE MOST FOLLOWED REAL ESTATE BRAND</h3>

<ul className="flex mt-2 space-x-2 ml-28">
  <li><FaFacebook className="h-14 w-14" /></li>
  <li><FaSquareXTwitter className="h-14 w-14" /></li>
  <li><TiSocialYoutubeCircular className="h-14 w-14" /></li>
  <li><FaSquareInstagram className="h-14 w-14" /></li>
  <li><RxLinkedinLogo className="h-14 w-14" /></li>
</ul>

<hr  className='bg-gray-950'></hr>
<div className='w-full text-white bg-black '> 
<div className="flex items-center justify-center mt-20">
  <ul className="flex space-x-4 text-center mt-16 text-[1.5rem]">
    <li>TERMS OF USE</li>
    <li>PRIVACY POLICY</li>
    <li>CCPA</li>
    <li>DMCA</li>
    <li>ACCESSIBILITY</li>
  </ul>
</div>

<div className='mt-16 text-[1.6rem]'>The Agency fully supports the Equal Housing Opportunity laws. The Agency IP Holdco, LLC and its parents, affiliates, subsidiaries, franchisees of its affiliates, and network partners make no representations, warranties, or guaranties as to the accuracy of the information contained herein, including square footage, lot size or other information concerning the condition, suitability or features of the property. All material is intended for informational purposes only and has been obtained from public records, MLS, or other sources believed to be reliable, but not verified. All prospective buyers should conduct a careful, independent investigation of the information and property, and consult with appropriate professionals, such as appraisers, architects, civil engineers, etc. CalDRE #01904054</div>




</div>


    </div>










  )
}
