import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

import Swal from "sweetalert2";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Search,
  X,
  CreditCard,
} from "lucide-react";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (title) => {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// ─── Cart Card ────────────────────────────────────────────────────────────────
const CartCard = ({ item, onIncrement, onDecrement, onRemove }) => {
  const color = stringToColor(item.title);
  const initials = getInitials(item.title);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div
        className="relative h-20 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}dd, ${color}55)`,
        }}
      >
        <span className="text-3xl font-bold text-white drop-shadow-lg tracking-wider">
          {initials}
        </span>
        <div className="absolute top-2 right-3 flex items-center gap-1.5">
          <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
            #{item._id.slice(0, 6)}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="absolute top-2 left-3 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-red-500/80 transition-colors text-white"
          title="Remove from cart"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            {item.subtitle}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {item.content}
        </p>

        {/* Price & Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Price
          </span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            ${(item.price || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Subtotal
          </span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            ${((item.price || 0) * item.quantity).toFixed(2)}
          </span>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Quantity
          </span>
          <div className="flex items-center gap-0">
            <button
              onClick={onDecrement}
              className="w-9 h-9 rounded-l-xl border border-gray-300 dark:border-gray-600 border-r-0 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-indigo-600 dark:text-indigo-400"
            >
              <Minus size={14} />
            </button>
            <div className="w-10 h-9 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
              {item.quantity}
            </div>
            <button
              onClick={onIncrement}
              className="w-9 h-9 rounded-r-xl border border-gray-300 dark:border-gray-600 border-l-0 bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center text-white"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Cart Page ────────────────────────────────────────────────────────────
const CartPage = () => {
  const {
    cartItems,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const filteredItems = cartItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle &&
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content &&
        item.content.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // ─── Clear cart with confirmation ──────────────────────────────────────────
  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Clear all items?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear all",
    });
    if (result.isConfirmed) {
      clearCart();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cart cleared",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 pb-28">
      {/* ─── Main content ─── */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back button */}
        <Link
          to="/product/list"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                My Cart
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
              </p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm"
            >
              <Trash2 size={14} />
              Clear Cart
            </button>
          )}
        </div>

        {/* Cart items */}
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Add some amazing posts to get started.
            </p>
            <button
              onClick={() => navigate("/product/list")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Browse Posts
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search items in cart…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Items grid */}
            {filteredItems.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  No matching items
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Try adjusting your search terms.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-sm"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <CartCard
                    key={item._id}
                    item={item}
                    onIncrement={() => increment(item._id)}
                    onDecrement={() => decrement(item._id)}
                    onRemove={() => removeFromCart(item._id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Sticky Bottom Summary ─── */}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Total items
                </span>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {totalItems}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Total price
                </span>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/product/list")}
                className="flex-1 sm:flex-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-5 py-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
