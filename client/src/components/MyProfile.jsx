import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../config/Api";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { user, accessToken, updateUserContext } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // 🟢 Update user profile (first name, last name, phone)
      const profileResponse = await axios.put(
        `${API_URL}/auth/updateuser`,
        {
          firstName,
          lastName,
          phone,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (profileResponse.status === 200) {
        updateUserContext(profileResponse.data.user); // ✅ Update context
        toast.success("Profile updated successfully!");
      }

      // 🔵 Change password if both old & new passwords are provided
      if (oldPassword && newPassword) {
        const passwordResponse = await axios.put(
          `${API_URL}/auth/change-password`,
          { oldPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (passwordResponse.status === 200) {
          toast.success("Password changed successfully!");
          setOldPassword(""); // Clear input fields after success
          setNewPassword("");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6 mt-10">
      {/* First Name, Last Name */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="text-lg font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-b border-gray-400  focus:outline-none p-2"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-lg font-medium">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-b border-gray-400  focus:outline-none p-2"
          />
        </div>
      </div>

      {/* Email, Phone */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="text-lg font-medium">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="border-b border-gray-400  focus:outline-none p-2"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-lg font-medium">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-b border-gray-400  focus:outline-none p-2"
          />
        </div>
      </div>

      {/* Password, Confirm Password */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="text-lg font-medium">Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border-b border-gray-400  focus:outline-none p-2"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-lg font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border-b border-gray-400  focus:outline-none p-2"
          />
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Your password will remain unchanged if left blank.
      </p>
      <button
        type="submit"
        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
      >
        Update Account
      </button>
    </form>
  );
};

export default MyProfile;
