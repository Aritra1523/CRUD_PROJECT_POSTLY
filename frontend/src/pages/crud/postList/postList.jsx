import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import usePostList from "../../../../customHooks/crud/usePostList";
import Pagination from "../../../components/pagination/Pagination";
import Swal from "sweetalert2";
import { ShoppingCart, Search, X, Plus, ChevronDown } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import PostCard from "../../../components/crudCom/PostCard"; // Your existing PostCard

const PostList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartCount } = useCart();

  const {
    products,
    currentPosts,
    loading,
    error,
    fetchProducts,
    currentPage,
    totalPages,
    goToPage,
  } = usePostList();

  const loggedInUserId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name");
  const userImage =
    localStorage.getItem("image") || "https://i.pravatar.cc/150?img=12";

  // Filter logic
  const filteredAll = searchTerm
    ? products.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : null;
  const displayPosts = filteredAll ?? currentPosts;
  const showPagination = !searchTerm;

  // ─── Handlers ────────────────────────────────────────────────────────────────
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
      Swal.fire({ title: "Logged Out", icon: "success" });
      navigate("/auth/login");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.delete(`/api/delete/${id}`, {
          headers: { "x-access-token": token },
        });
        if (res.data.status) {
          Swal.fire({ title: "Deleted!", icon: "success" });
          fetchProducts();
        }
      } catch (error) {
        Swal.fire({ title: "Error!", text: "Delete Failed", icon: "error" });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        text: "Your post is safe 🙂",
        icon: "info",
      });
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    // ✅ Now using solid background – exactly like Login & Register pages
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ─── Navbar ─── */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                Post
                <span className="text-indigo-600 dark:text-indigo-400">ly</span>
              </span>
            </Link>

            {/* Search - centered */}
            <div className="flex-1 max-w-xl mx-6 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-gray-700 border-0 rounded-xl py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/product/create"
                className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Link>

              <Link
                to="/cart"
                className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-full pl-2 pr-3 py-1 transition-colors"
                >
                  <img
                    src={userImage}
                    alt="profile"
                    className="w-8 h-8 rounded-full border-2 border-indigo-300 dark:border-indigo-500 object-cover"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {userName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        View your profile
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                      👤 Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/orders");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                      📦 Order History
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-red-600 dark:text-red-400 text-sm font-medium"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-gray-700 border-0 rounded-xl py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section – subtle gradient overlay remains, but background is solid */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/40 to-purple-100/40 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl -z-10" />
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
                ✨ Discover & Share
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-lg">
                Explore amazing content from creators like you. Join the
                conversation!
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/product/create"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-14 h-14 border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center border border-red-200 dark:border-red-800 mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        {!loading && products.length > 0 ? (
          <>
            {/* Page info */}
            {showPagination && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Showing{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {(currentPage - 1) * 6 + 1}–
                  {Math.min(currentPage * 6, products.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {products.length}
                </span>{" "}
                posts
              </p>
            )}

            {/* Grid with staggered animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {displayPosts.length > 0 ? (
                displayPosts.map((item, index) => (
                  <div
                    key={item._id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PostCard
                      item={item}
                      handleDelete={handleDelete}
                      navigate={navigate}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                    alt="No Results"
                    className="w-52 h-52 object-contain opacity-80 dark:opacity-60"
                  />
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-5">
                    No Posts Found
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                    No posts found for{" "}
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                      "{searchTerm}"
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {showPagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            )}
          </>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <img
                src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
                alt="empty"
                className="w-40 mb-5 opacity-80 dark:opacity-60"
              />
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                No Posts Yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Be the first to share your story
              </p>
              <Link
                to="/product/create"
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Create Post
              </Link>
            </div>
          )
        )}
      </main>

      {/* ─── CSS Animations ─── */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PostList;
