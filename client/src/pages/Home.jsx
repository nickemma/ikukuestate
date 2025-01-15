import React, { useState, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaGreaterThan } from "react-icons/fa6";
import { FaLessThan } from "react-icons/fa6";



export default function Home() {

  const sliderRef = useRef(null);

  const settings = {
    dots: false, // Disable dots
    infinite: false, // Stop at the last slide
    speed: 500, // Animation speed
    slidesToShow: 3, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    arrows: false, // Disable default arrows
  };

  
// Custom navigation handlers
const handlePrev = () => {
  sliderRef.current.slickPrev();
};

const handleNext = () => {
  sliderRef.current.slickNext();
};
  
  const Customsign = ({ className, style, onClick, icon }) => (
    <div
      className={`${className} custom-arrow`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "20px",
      }}
      onClick={onClick}
    >
      {icon}
    </div>
  );
  
  const images = [
    { src: '/video 1.jpg', state: 'LAGOS STATE' },
    { src: '/video 2.jpg', state: 'RIVERS STATE' },
    { src: '/video 3.jpg', state: 'EDO STATE' },
    { src: '/image1.jpg', state: 'OGUN STATE' },
    { src: '/image5.jpg', state: 'ABIA STATE' },
    { src: '/image6.jpg', state: 'IMO STATE' },
    { src: '/image2.jpg', state: 'KANO STATE' },
  ];
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bestTimeToCall: '',
    selectedAgent: '',
    address: '',
    message: '',
    consent: false,
  });

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission logic
  const handleSubmit = () => {
    // Check for empty fields
    const isFormComplete = Object.values(formData).every((value) => value !== '' && value !== false);

    if (!isFormComplete) {
      alert('Please fill in all fields.');
    } else if (!formData.consent) {
      alert('Please consent to receive marketing/promotional content.');
    } else {
      // Logic to handle form submission
      alert('Form Submitted');
     
    }
  };


  console.log('Home component is rendering');
  
  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen px-6 bg-gray-800">
        <video className="absolute object-cover w-full h-full" autoPlay loop muted>
          <source src="/real estate.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute flex items-center space-x-4 text-white left-[20rem] text-[3rem] mt-[8rem] font-normal">
          <h>
            Your window to the <br />
            <span className="italic">world's finest</span> real estate
          </h>
        </div>
        <div className="absolute flex items-center space-x-4 bottom-8 left-[20rem]">
  <Link to="/buy" className="flex items-center space-x-2">
    <h1 className="text-3xl font-bold text-white">Explore Listings</h1>
    <FaArrowRight className="text-3xl text-white" />
  </Link>
</div>

      </div>

    <div className="px-6 mt-[5rem] bg-gray-100">
    <h2 className="text-red-500 text-[2rem] ml-[22rem]">GLOBAL REGIONS</h2>
      <div className="flex ml-[22rem] mt-4">
        <h3 className="text-[2rem]">
          <span className="italic">Wherever</span> you’re going, we can take{' '}
          <span className="italic">you there</span>
        </h3>
        <Link to="/region">
          <button className="h-14 bg-red-600 w-[20rem] text-white text-[1.5rem] ml-[14rem] mt-4">
            Discover Global Regions
          </button>
        </Link>
      </div>

      <Slider ref={sliderRef} {...settings} className="mt-10">
        {images.map((item, index) => (
          <div key={index} className="px-2 text-center">
            <div className="w-full h-[38rem] overflow-hidden bg-white rounded-md">
              <img
                src={item.src}
                alt={item.state}
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold mr-[27rem]">{item.state}</h2>
            
            <div className="mt-2">
              <Link
                to="/region"
                className="flex items-center justify-center space-x-2 text-red-600 group"
              >
                <div className='flex mr-[30rem]'>   
                <span className="text-lg font-semibold ">Discover</span>
                <FaArrowRight className="mt-2 transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
                </div>
              </Link>
            </div>
            
          </div>
        ))}
      </Slider>

      {/* Custom arrows below images */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          className="p-2"
          onClick={handlePrev}
        >
          <FaLessThan size={20} />
        </button>
        <button
          className="p-2 "
          onClick={handleNext}
        >
          <FaGreaterThan size={20} />
        </button>
      </div>
    </div>


 {/* Discover listing */}
      <div className="px-6 mt-10">
  <h1 className="font-bold text-[3rem] ml-[8rem]">Popular Categories</h1>
  <h2 className="text-[2rem] ml-[8rem]">Find the right property for you</h2>

  <div className="px-6 mt-[5rem]">
    {/* Image Grid Section */}
    <div className="grid grid-cols-3 gap-6">
      {/* First Image (Vertical) */}
      <div className="relative w-full h-[77.6rem] bg-white rounded-md overflow-hidden row-span-2">
        <img
          src="/image1.jpg"
          alt="Image 1"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white bg-black bg-opacity-50">
          <h2 className="text-3xl font-bold">Home and Apartment</h2>
          <p className="mt-2 text-lg">Popular</p>
        </div>
      </div>

      {/* Remaining Images (2 by 2 Grid) */}
      {[
        { src: "/video 3.jpg", title: "Shortlet", subtitle: "Popular" },
        { src: "/image5.jpg", title: "Commercial Property", subtitle: "Popular" },
        { src: "/image4.jpg", title: "Land and Plots", subtitle: "Popular" },
        { src: "/event.jpg", title: "Event Center and Venues", subtitle: "Popular" },
      ].map((image, index) => (
        <div
          key={index}
          className="relative w-full h-[38rem] bg-white rounded-md overflow-hidden"
        >
          <img
            src={image.src}
            alt={`Image ${index + 2}`}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 text-white bg-black bg-opacity-50">
            <h2 className="text-2xl font-bold">{image.title}</h2>
            <p className="mt-2 text-lg">{image.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  

      {/* Lets Connect Section */}
      <div className=" mt-[10rem]">
        <div className="flex items-center justify-between w-full h-[100vh] px-6">
          {/* Image Section */}
          <div className="relative w-1/2 h-full">
  <img src="/forever.jpg" alt="forever" className="object-cover w-full h-full" />
  {/* Black overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
  
  <div className="absolute inset-0 flex flex-col items-start justify-center pl-16 text-white mt-[24rem]">
    <h1 className="text-[2.2rem] leading-tight">
      Real estate isn’t <br /> just business. <br />
      <span className="italic">It’s personal.</span>
    </h1>
    <p className="mt-6 text-[2.5rem] font-bold">LET’S CONNECT.</p>
  </div>
</div>

          {/* Form Section */}
          <div className="flex flex-col justify-center w-1/2 h-full space-y-6">
            <form className="space-y-6">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none"
              />
              <div className="flex flex-col space-y-4">
                <select
                  name="bestTimeToCall"
                  value={formData.bestTimeToCall}
                  onChange={handleChange}
                  className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                >
                  <option>Best Time to Call</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>

                <select
                  name="selectedAgent"
                  value={formData.selectedAgent}
                  onChange={handleChange}
                  className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                >
                  <option>Select an Agent</option>
                  
                </select>
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address (Optional)"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full px-4 py-3 font-bold border-b-2 border-gray-300 focus:outline-none"
              ></textarea>
              <div className="flex items-center ml-6 space-x-2">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData({ ...formData, consent: e.target.checked })
                  }
                />
                <label className="mt-6 font-bold">
                  By submitting your information, you consent to receive marketing/promotional content by email, SMS, and/or phone. Message and data rates may apply. You may opt out at any time per our{' '}
                  <span className="text-red-500">Privacy Policy.</span>
                </label>
              </div>

              {/* Let's Connect Arrow */}
              <div
                className="flex items-center ml-[40rem] font-semibold space-x-2 text-red-600 text-[1.5rem] cursor-pointer"
                onClick={handleSubmit}
              >
                <span className="text-[1.5rem] font-semibold">Let's connect</span>
                <FaArrowRight className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
              </div>
            </form>
          </div>
        </div>
        

        


        
      </div>
    </>
  );
}
