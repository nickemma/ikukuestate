import { useState } from "react";

const FormContent = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // For the checkbox
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    besttimetocall: "",
    selltimeframe: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Send form data to the server
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setPopupVisible(true); // Show popup on success
        setFormData({
          fname: "",
          lname: "",
          email: "",
          phone: "",
          besttimetocall: "",
          selltimeframe: "",
        }); // Reset form
      } else {
        alert("Failed to send your message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <section className="form-content flex justify-center items-center min-h-screen px-4">
      <form
        className="w-full max-w-3xl p-8 bg-white"
        onSubmit={handleFormSubmit}
      >
        <h2 className="text-2xl text-red-600 font-semibold text-center mb-6">
          Connect With An Expert
        </h2>
        <p className="text-center text-gray-700 mb-6">
          We&apos;ll match you with an agent who understands the nuances of your
          area and the local market conditions.
        </p>
        {/* Form Fields */}
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          value={formData.fname}
          onChange={handleInputChange}
          required
          className="mb-4 border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0"
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={formData.lname}
          onChange={handleInputChange}
          required
          className="mb-4 border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="mb-4 border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number (optional)"
          value={formData.phone}
          onChange={handleInputChange}
          className="mb-4 border-b border-gray-300 py-2 w-full focus:outline-none focus:ring-0"
        />
        <select
          name="besttimetocall"
          value={formData.besttimetocall}
          onChange={handleInputChange}
          required
          className="mb-4 border-b border-gray-300 py-2 w-full bg-transparent focus:outline-none focus:ring-0"
        >
          <option disabled value="">
            Best time to call
          </option>
          <option>Anytime</option>
          <option>In the morning</option>
          <option>In the afternoon</option>
          <option>In the evening</option>
        </select>
        <select
          name="selltimeframe"
          value={formData.selltimeframe}
          onChange={handleInputChange}
          required
          className="mb-4 border-b border-gray-300 py-2 w-full bg-transparent focus:outline-none focus:ring-0"
        >
          <option disabled value="">
            Choose A Timeframe
          </option>
          <option>Now</option>
          <option>Four to eight months</option>
          <option>Eight to twelve months</option>
          <option>In the next two years</option>
        </select>
        <div className="flex items-start mb-6">
          <input
            type="checkbox"
            id="Consent"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 mr-2"
          />
          <label htmlFor="Consent" className="text-sm">
            By submitting your information, you consent to receive
            marketing/promotional content by email, SMS, and/or phone. Message
            and data rates may apply. You may opt out at any time per our{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={!isChecked}
            className={`px-6 py-2 ${
              isChecked ? "bg-red-600" : "bg-gray-300 cursor-not-allowed"
            } text-white font-semibold rounded`}
          >
            Let&apos;s Connect
          </button>
        </div>
      </form>

      {/* Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-sm w-full">
            <header className="mb-4">
              <h2 className="text-2xl font-bold text-red-600">Thank you</h2>
            </header>
            <p className="text-gray-700 mb-6">
              Thank you. Your inquiry has been received.
            </p>
            <button
              onClick={closePopup}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FormContent;
