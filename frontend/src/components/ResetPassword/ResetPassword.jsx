import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../../api/axios";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

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
const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Basic client validation ──
    const newErrors = {};
    if (!data.password) newErrors.password = "Password is required";
    if (data.password.length < 6) newErrors.password = "Password must be at least 8 characters";
    if (!data.confirm_password) newErrors.confirm_password = "Please confirm your password";
    if (data.password !== data.confirm_password) newErrors.confirm_password = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/auth/reset-password/${id}/${token}`, data);

      if (res.data.status) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password Reset Successfully",
          confirmButtonColor: "#6366f1",
          background: "var(--bg-card, #ffffff)",
          customClass: {
            popup: "rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700",
            confirmButton: "px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all",
          },
        });
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || "Reset Password Failed";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        confirmButtonColor: "#ef4444",
        background: "var(--bg-card, #ffffff)",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700",
          confirmButton: "px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center px-4 py-10">
      {/* ─── Loading overlay ─── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <Spinner size={40} color="#6366f1" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Resetting password…</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* ─── Back to login ─── */}
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* ─── Form Card ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
          {/* ─── Header ─── */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Reset Password
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ─── New Password ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min 6 characters"
                  value={data.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                    errors.password
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* ─── Confirm Password ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm your password"
                  value={data.confirm_password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2.5 rounded-xl border ${
                    errors.confirm_password
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.confirm_password}</p>
              )}
            </div>

            {/* ─── Submit Button ─── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size={18} color="#fff" />
                  Resetting…
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* ─── Footer ─── */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Remember your password?{" "}
            <Link to="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
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

export default ResetPassword;