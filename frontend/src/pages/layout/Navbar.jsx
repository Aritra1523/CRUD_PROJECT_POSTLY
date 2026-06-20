import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import SearchBar from "../../components/searchbar/SearchBar";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get user data from localStorage
  const userName = localStorage.getItem("name") || "User";
  const userImage =
    localStorage.getItem("image") || "https://i.pravatar.cc/150?img=12";

  // Logout handler
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("name");
      localStorage.removeItem("image");

      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully",
        icon: "success",
      });

      navigate("/auth/login");
    }
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Post Dashboard</h1>
        <p className="text-sm text-gray-500">Manage and create your posts</p>
      </div>

      {/* Center - Search */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Add Post */}
        <Link
          to="/product/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-blue-300 transition-all duration-300 hover:scale-105"
        >
          + Add Post
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-slate-200 transition-all duration-300"
          >
            <img
              src={userImage}
              alt="profile"
              className="w-11 h-11 rounded-full border-2 border-blue-500 object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{userName}</h3>
              <p className="text-xs text-gray-500">View Options</p>
            </div>
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-5 py-3 hover:bg-slate-100 transition-all duration-200 text-gray-700 font-medium"
              >
                👤 Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 hover:bg-red-100 transition-all duration-200 text-red-600 font-medium"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;