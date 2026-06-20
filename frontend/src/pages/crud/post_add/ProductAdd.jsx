
import React, { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductValidator } from "../../../validators/postValidator";
import { useForm } from "react-hook-form";
import useAddPost from "../../../../customHooks/crud/useAddPost";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { FileText, Subtitles, AlignLeft, X, Plus, ArrowLeft } from "lucide-react";

// ─── Spinner (same as auth pages) ─────────────────────────────────────────────
const Spinner = ({ size = 18, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ animation: "spin 0.75s linear infinite", flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const ProductAdd = () => {
  const { addPost, loading, error } = useAddPost();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ProductValidator),
  });

  const onSubmit = async (data) => {
    const res = await addPost(data);
    if (res?.status) {
      const result = await Swal.fire({
        title: "Success!",
        text: "Post Created Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      });
      if (result.isConfirmed) {
        navigate("/product/list");
      }
    } else {
      // Show API error via toast or Swal
      Swal.fire({
        title: "Error!",
        text: res?.message || "Failed to create post. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 py-10 px-4">
      {/* ─── Submit loading overlay ─── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <Spinner size={40} color="#6366f1" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Creating your post…</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* ─── Back button ─── */}
        <Link
          to="/product/list"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Link>

        {/* ─── Form Card ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
          {/* ─── Header ─── */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <Plus className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Create New Post
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Share your thoughts with the community
            </p>
          </div>

          {/* ─── API Error ─── */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* ─── Title ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Post Title
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Enter a catchy title"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                />
              </div>
              {errors.title && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* ─── Subtitle ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subtitle
              </label>
              <div className="relative">
                <Subtitles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  {...register("subtitle")}
                  type="text"
                  placeholder="A short subtitle (optional)"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.subtitle ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                />
              </div>
              {errors.subtitle && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.subtitle.message}</p>
              )}
            </div>

            {/* ─── Content ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Content
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <textarea
                  {...register("content")}
                  rows="6"
                  placeholder="Write your content here..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    errors.content ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none resize-y focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                />
              </div>
              {errors.content && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* ─── Actions ─── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size={18} color="#fff" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Publish Post
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/product/list")}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── CSS Animation (spinner) ─── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductAdd;