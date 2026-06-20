// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../../../api/axios";
// import Swal from "sweetalert2";

// const ProductUpdate = () => {
//   const { id } = useParams();

//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     title: "",
//     subtitle: "",
//     content: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

  
//   // FETCH SINGLE POST DETAILS
  
//   const fetchPostDetails = async () => {
//   try {
//     setLoading(true);

//     const token = localStorage.getItem("token");

//     const res = await axiosInstance.get(
//       `/api/post/${id}`,
//       {
//         headers: {
//           "x-access-token": token,
//         },
//       }
//     );

//     // console.log("details", res.data);

//     if (res.data.status) {
//       setData({
//         title: res.data.data.title || "",
//         subtitle: res.data.data.subtitle || "",
//         content: res.data.data.content || "",
//       });
//     }

//   } catch (error) {
//     console.log(error);

//     Swal.fire({
//       title: "Error",
//       text: error.response?.data?.message || "Unable to fetch details",
//       icon: "error",
//     });

//   } finally {
//     setLoading(false);
//   }
// };

//   // Load data on page open
//   useEffect(() => {
//     fetchPostDetails();
//   }, []);


//   // HANDLE CHANGE

//   const handleChange = (e) => {
//     setData({
//       ...data,
//       [e.target.name]: e.target.value,
//     });
//   };

  
//   // HANDLE UPDATE
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const res = await axiosInstance.put(
//         `/api/post/update/${id}`,
//         data,
//         {
//           headers: {
//             "x-access-token": token,
//           },
//         }
//       );

//       console.log(res.data);

//       if (res.data.status) {
//         await Swal.fire({
//           title: "Updated!",
//           text: "Post Updated Successfully",
//           icon: "success",
//         });

//         navigate("/product/list");
//       }

//     } catch (error) {
//       console.log(error);

//       setError(
//         error.response?.data?.message ||
//         "Update Failed"
//       );

//       Swal.fire({
//         title: "Oops",
//         text: "Something went wrong",
//         icon: "error",
//       });

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 px-4 py-10">

//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"
//       >
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Update Post
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Edit your post information
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-5 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Title */}
//         <div className="mb-5">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Title
//           </label>

//           <input
//             type="text"
//             name="title"
//             value={data.title}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-200"
//           />
//         </div>

//         {/* Subtitle */}
//         <div className="mb-5">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Subtitle
//           </label>

//           <input
//             type="text"
//             name="subtitle"
//             value={data.subtitle}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-200"
//           />
//         </div>

//         {/* Content */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Content
//           </label>

//           <textarea
//             name="content"
//             rows="6"
//             value={data.content}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none resize-none focus:ring-4 focus:ring-blue-200"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
//         >
//           {loading ? "Updating..." : "Update Post"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProductUpdate;



import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import Swal from "sweetalert2";
import { FileText, Subtitles, AlignLeft, ArrowLeft, X, Edit } from "lucide-react";

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
const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    subtitle: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  // ─── Fetch post details ──────────────────────────────────────────────────────
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/api/post/${id}`, {
        headers: { "x-access-token": token },
      });

      if (res.data.status) {
        setData({
          title: res.data.data.title || "",
          subtitle: res.data.data.subtitle || "",
          content: res.data.data.content || "",
        });
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || "Unable to fetch details";
      setFetchError(msg);
      Swal.fire({
        title: "Error",
        text: msg,
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(`/api/post/update/${id}`, data, {
        headers: { "x-access-token": token },
      });

      if (res.data.status) {
        await Swal.fire({
          title: "Updated!",
          text: "Post Updated Successfully",
          icon: "success",
          confirmButtonColor: "#6366f1",
        });
        navigate("/product/list");
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || "Update Failed";
      setError(msg);
      Swal.fire({
        title: "Oops",
        text: msg,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 py-10 px-4">
      {/* ─── Submit loading overlay ─── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <Spinner size={40} color="#6366f1" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Updating your post…</p>
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
              <Edit className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Update Post
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Edit your post information
            </p>
          </div>

          {/* ─── Fetch Error ─── */}
          {fetchError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{fetchError}</span>
            </div>
          )}

          {/* ─── API Error ─── */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ─── Title ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Post Title
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  placeholder="Enter a catchy title"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* ─── Subtitle ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subtitle
              </label>
              <div className="relative">
                <Subtitles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="subtitle"
                  value={data.subtitle}
                  onChange={handleChange}
                  placeholder="A short subtitle (optional)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* ─── Content ─── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Content
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <textarea
                  name="content"
                  rows="6"
                  value={data.content}
                  onChange={handleChange}
                  placeholder="Write your content here..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none resize-y focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800/40 focus:border-indigo-500 transition-all"
                />
              </div>
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
                    Updating…
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Update Post
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

export default ProductUpdate;