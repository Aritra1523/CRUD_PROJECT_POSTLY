// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../../api/axios";
// import endPoints from "../../../../api/endpoints";
// import Swal from "sweetalert2";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

//   // Fetch Profile
//   const fetchProfile = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const res = await axiosInstance.get(
//         endPoints.auth.profile,
//         {
//           headers: {
//             "x-access-token": token,
//           },
//         }
//       );

//       console.log("res.data", res.data);

//       // FIXED HERE
//       if (res.data.status) {
//         setProfile(res.data.data);
//       }

//     } catch (error) {
//       console.log(error);

//       setError(
//         error.response?.data?.message ||
//           "Profile Fetch Failed"
//       );

//       Swal.fire({
//         title: "Error!",
//         text: "Unable to load profile",
//         icon: "error",
//       });

//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   // Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 flex items-center justify-center px-4 py-10">

//       <div
//         className="
//           w-full
//           max-w-md
//           bg-white
//           rounded-3xl
//           shadow-2xl
//           p-8
//         "
//       >

//         {/* Header */}
//         <div className="text-center mb-8">

//           {/* Profile Image */}
//           {profile?.imagePath ? (
//             <img
//               src={`http://localhost:4000/${profile.imagePath}`}
//               alt="profile"
//               className="
//                 w-24
//                 h-24
//                 rounded-full
//                 object-cover
//                 border-4
//                 border-blue-500
//                 mx-auto
//                 mb-4
//               "
//             />
//           ) : (
//             <div
//               className="
//                 w-24
//                 h-24
//                 rounded-full
//                 bg-blue-600
//                 text-white
//                 flex
//                 items-center
//                 justify-center
//                 text-3xl
//                 font-bold
//                 mx-auto
//                 mb-4
//               "
//             >
//               {profile?.name?.charAt(0)}
//             </div>
//           )}

//           <h1 className="text-3xl font-bold text-gray-800">
//             My Profile
//           </h1>

//           <p className="text-gray-500 mt-2">
//             User Information
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4">
//             {error}
//           </div>
//         )}

//         {/* Profile Data */}
//         {profile && (
//           <div className="space-y-5">

//             {/* Name */}
//             <div>
//               <label className="text-sm text-gray-500">
//                 Name
//               </label>

//               <div className="mt-1 text-lg font-semibold text-gray-800">
//                 {profile.name}
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-sm text-gray-500">
//                 Email
//               </label>

//               <div className="mt-1 text-lg font-semibold text-gray-800">
//                 {profile.email}
//               </div>
//             </div>

//             {/* Address */}
//             <div>
//               <label className="text-sm text-gray-500">
//                 Address
//               </label>

//               <div className="mt-1 text-lg font-semibold text-gray-800">
//                 {profile.address || "No Address"}
//               </div>
//             </div>

//             {/* User ID */}
//             <div>
//               <label className="text-sm text-gray-500">
//                 User ID
//               </label>

//               <div className="mt-1 text-sm break-all text-gray-700">
//                 {profile._id}
//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import endPoints from "../../../../api/endpoints";
import Swal from "sweetalert2";
import { User, Mail, MapPin, Hash, ArrowLeft, UserCircle } from "lucide-react";

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
const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Fetch Profile ──────────────────────────────────────────────────────────
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(endPoints.auth.profile, {
        headers: { "x-access-token": token },
      });

      if (res.data.status) {
        setProfile(res.data.data);
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || "Profile Fetch Failed";
      setError(msg);
      Swal.fire({
        title: "Error!",
        text: "Unable to load profile",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 py-10 px-4">
      {/* ─── Loading overlay ─── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <Spinner size={40} color="#6366f1" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Loading profile…</p>
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

        {/* ─── Profile Card ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
          {/* ─── Header ─── */}
          <div className="text-center mb-8">
            {/* Profile Image */}
            {profile?.imagePath ? (
              <img
                src={`http://localhost:4000/${profile.imagePath}`}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-400 dark:border-indigo-500 mx-auto mb-4 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-md">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              My Profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              User Information
            </p>
          </div>

          {/* ─── Error ─── */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ─── Profile Data ─── */}
          {profile && (
            <div className="space-y-5">
              {/* Name */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  <User className="w-4 h-4" />
                  Name
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white break-words">
                  {profile.name}
                </p>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white break-words">
                  {profile.email}
                </p>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  <MapPin className="w-4 h-4" />
                  Address
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white break-words">
                  {profile.address || "No Address"}
                </p>
              </div>

              {/* User ID */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  <Hash className="w-4 h-4" />
                  User ID
                </div>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                  {profile._id}
                </p>
              </div>
            </div>
          )}

          {/* ─── Actions ─── */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate("/product/list")}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              Back to Posts
            </button>
          </div>
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

export default Profile;