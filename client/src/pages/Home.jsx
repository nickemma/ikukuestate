import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
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
      // You can replace this with your actual submission logic (e.g., sending data to a server)
    }
  };

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
          <h1 className="text-3xl font-bold text-white">Explore Listings</h1>
          <a href="/buy" className="text-3xl text-white">
            <FaArrowRight className="text-white" />
          </a>
        </div>
      </div>

  {/* Global Region */}
  <div className="px-6 mt-[5rem]">
        <h className="text-red-500 text-[2rem] ml-[22rem]">GLOBAL REGIONS</h>
        <br />
        <div className="flex ml-[22rem]">
          <h className="text-[2rem]">
            <span className="italic">Wherever</span> you’re going, we can take{' '}
            <span className="italic">you there</span>
          </h>
          <button className="h-14 bg-red-600 w-[20rem] text-white text-[1.5rem] ml-[14rem] mt-4">
            Discover Global Regions
          </button>
        </div>

        {/* Image Boxes */}
        <div className="flex justify-center p-10 space-x-6">
          {/* Box 1 */}
          <div className="w-[32rem] text-center">
            <div className="w-full h-[38rem] overflow-hidden bg-white rounded-md">
              <img
                src="/video 1.jpg"
                alt="Image 1"
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold  mr-[22.4rem]">LAGOS STATE</h2>
            <div className="mt-2  mr-[26rem]">
              <a
                href="/buy"
                className="flex items-center justify-center space-x-2 text-red-600 group"
              >
                <span className="text-lg font-semibold">Discover</span>
                <FaArrowRight className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
              </a>
            </div>
          </div>

          {/* Box 2 */}
          <div className="w-[32rem] text-center">
            <div className="w-full h-[38rem] overflow-hidden bg-white rounded-md">
              <img
                src="/video 2.jpg"
                alt="Image 2"
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold mr-[22rem]">RIVERS STATE</h2>
            <div className="mt-2 mr-[25.5rem]">
              <a
                href="/buy"
                className="flex items-center justify-center space-x-2 text-red-600 group"
              >
                <span className="text-lg font-semibold">Discover</span>
                <FaArrowRight className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
              </a>
            </div>
          </div>

          {/* Box 3 */}
          <div className="w-[32rem] text-center">
            <div className="w-full h-[38rem] overflow-hidden bg-white rounded-md">
              <img
                src="/video 3.jpg"
                alt="Image 3"
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold mr-[24rem]">EDO STATE</h2>
            <div className="mt-2 mr-[25.6rem]">
              <a
                href="/buy"
                className="flex items-center justify-center space-x-2 text-red-600 group"
              >
                <span className="text-lg font-semibold">Discover</span>
                <FaArrowRight className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

 {/* Discover listing */}
      <div className="px-6">
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
      <div className="px-6 mt-[10rem]">
        <div className="flex items-center justify-between w-full h-[100vh] px-6">
          {/* Image Section */}
          <div className="w-1/2 h-full">
            <img src="/forever.jpg" alt="forever" className="object-cover w-full h-full" />
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
                  {/* Add your agent options here */}
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
