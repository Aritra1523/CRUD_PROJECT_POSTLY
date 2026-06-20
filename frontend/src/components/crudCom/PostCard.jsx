import React, { useState } from "react";
import { Eye, Edit, Trash2, ShoppingCart, Check, Calendar, User, Clock, DollarSign } from "lucide-react";
import Swal from "sweetalert2";
import { useCart } from "../../context/CartContext";

const PostCard = ({ item, handleDelete, navigate }) => {
  const { addToCart, isInCart } = useCart();
  const alreadyInCart = isInCart(item._id);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // ─── Price state (default $10.00) ─────────────────────────────────────────
  const [price, setPrice] = useState(10.00);

  // ─── Get initials for fallback ─────────────────────────────────────────────
  const getInitials = (title) => {
    return title
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ─── Deterministic color from title ─────────────────────────────────────────
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  };

  const color = stringToColor(item.title);

  // ─── Format date ────────────────────────────────────────────────────────────
  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  // ─── Estimate reading time ──────────────────────────────────────────────────
  const readingTime = item.content
    ? Math.max(1, Math.ceil(item.content.split(/\s+/).length / 200))
    : 1;

  // ─── Generate a unique, deterministic placeholder image ────────────────────
  const getPlaceholderImage = () => {
    const seed = item._id || item.title || "default";
    return `https://picsum.photos/seed/${seed}/600/400`;
  };

  const imageSrc = item.image && !imageError ? item.image : getPlaceholderImage();

  // ─── Add to cart with price ────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (alreadyInCart) {
      Swal.fire({
        icon: "warning",
        title: "Already Added",
        text: "This item is already in your cart!",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "Got it",
      });
      return;
    }
    // 👇 Pass the price when adding to cart
    addToCart(item, price);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Added to cart ($${price.toFixed(2)}) 🛒`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 overflow-hidden hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── Image Section ─── */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
        <img
          src={imageSrc}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge: Post ID */}
        <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">
          #{item._id.slice(0, 6)}
        </span>

        {/* Badge: Date */}
        <span className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>

        {/* Badge: Reading time */}
        <span className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {readingTime} min
        </span>
      </div>

      {/* ─── Content ─── */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {item.title}
        </h3>

        {/* Subtitle / Author */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {item.userName || "Anonymous"}
          </span>
          {item.subtitle && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-gray-400 dark:text-gray-500">{item.subtitle}</span>
            </>
          )}
        </div>

        {/* Divider with decorative dot */}
        <div className="flex items-center gap-3 my-3">
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Content preview */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 text-sm">
          {item.content.split(".")[0]}.
        </p>

        {/* ─── Price & Category Row ─── */}
        <div className="flex items-center justify-between mt-3">
          {/* Price - with dollar sign and input */}
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-20 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Category tag */}
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${color}22`, color: color }}
          >
            {item.category || "General"}
          </span>
        </div>

        {/* ─── Action Buttons ─── */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => navigate(`/product/update/${item._id}`)}
            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all duration-300 hover:scale-110"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 transition-all duration-300 hover:scale-110"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/product/details/${item._id}`)}
            className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:scale-110"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={alreadyInCart}
            className={`flex-1 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
              alreadyInCart
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105 shadow-md"
            }`}
            title={alreadyInCart ? "Already in cart" : "Add to cart"}
          >
            {alreadyInCart ? (
              <>
                <Check className="w-4 h-4" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;