import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const MyProfile = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    // Handle updating user information here, e.g., making an API call
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="flex flex-col">
        <label className="text-lg font-medium">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 bg-gray-200"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-medium">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 bg-gray-200"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-medium">Email</label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="border border-gray-300 rounded-md p-2 bg-gray-200"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-medium">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-medium">Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-medium">Confirm Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition duration-300"
      >
        Update Account
      </button>

      <p className="text-sm text-gray-500 mt-2">
        Your password will remain unchanged if left blank.
      </p>
    </form>
  );
};

export default MyProfile;
