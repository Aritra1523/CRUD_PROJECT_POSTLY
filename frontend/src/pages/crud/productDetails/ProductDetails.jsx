// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../../../../api/axios";
// import Swal from "sweetalert2";

// const ProductDetails = () => {
//   const { id } = useParams();

//   const navigate = useNavigate();

//   const [post, setPost] = useState(null);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

//   // Fetch Single Post
//   const fetchPost = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       const res = await axiosInstance.get(
//         `/api/post/${id}`,
//         {
//           headers: {
//             "x-access-token": token,
//           },
//         }
//       );

//       console.log(res.data);

//       if (res.data.status) {
//         setPost(res.data.data);
//       }

//     } catch (error) {
//       console.log(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to fetch post"
//       );

//       Swal.fire({
//         title: "Error!",
//         text: "Unable to load post details",
//         icon: "error",
//       });

//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPost();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 py-10 px-4">
      
//       <div
//         className="
//           max-w-3xl
//           mx-auto
//           bg-white
//           rounded-3xl
//           shadow-2xl
//           p-8
//           border
//           border-gray-100
//         "
//       >
        
//         {/* Heading */}
//         <div className="mb-8 text-center">
          
//           <h1 className="text-4xl font-bold text-gray-800">
//             Post Details
//           </h1>

//           <p className="text-gray-500 mt-2">
//             View complete post information
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-5">
//             {error}
//           </div>
//         )}

//         {/* Post Data */}
//         {post && (
//           <>
//             {/* Title */}
//             <div className="mb-6">
              
//               <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                 Title
//               </h2>

//               <p className="text-3xl font-bold text-gray-800 mt-2">
//                 {post.title}
//               </p>
//             </div>

//             {/* Subtitle */}
//             <div className="mb-6">
              
//               <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                 Subtitle
//               </h2>

//               <p className="text-lg text-gray-700 mt-2">
//                 {post.subtitle}
//               </p>
//             </div>

//             {/* Content */}
//             <div className="mb-6">
              
//               <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                 Content
//               </h2>

//               <p className="text-gray-700 leading-8 mt-2">
//                 {post.content}
//               </p>
//             </div>

//             {/* ID */}
//             <div className="mb-8">
              
//               <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                 Post ID
//               </h2>

//               <p className="text-gray-600 mt-2 break-all">
//                 {post._id}
//               </p>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4">
              
//               <button
//                 onClick={() =>
//                   navigate(`/product/update/${post._id}`)
//                 }
//                 className="
//                   flex-1
//                   bg-blue-600
//                   hover:bg-blue-700
//                   text-white
//                   py-3
//                   rounded-xl
//                   font-semibold
//                   transition-all
//                   duration-300
//                 "
//               >
//                 Edit Post
//               </button>

//               <button
//                 onClick={() => navigate("/product/list")}
//                 className="
//                   flex-1
//                   bg-gray-200
//                   hover:bg-gray-300
//                   text-gray-800
//                   py-3
//                   rounded-xl
//                   font-semibold
//                   transition-all
//                   duration-300
//                 "
//               >
//                 Back
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../../api/axios";
import Swal from "sweetalert2";
import { Eye, FileText, Subtitles, AlignLeft, Hash, ArrowLeft, Edit } from "lucide-react";

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
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Fetch post ──────────────────────────────────────────────────────────────
  const fetchPost = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/api/post/${id}`, {
        headers: { "x-access-token": token },
      });

      if (res.data.status) {
        setPost(res.data.data);
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || "Failed to fetch post";
      setError(msg);
      Swal.fire({
        title: "Error!",
        text: "Unable to load post details",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 py-10 px-4">
      {/* ─── Loading overlay ─── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <Spinner size={40} color="#6366f1" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Loading post…</p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* ─── Back button ─── */}
        <Link
          to="/product/list"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Link>

        {/* ─── Details Card ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
          {/* ─── Header ─── */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <Eye className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Post Details
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              View complete post information
            </p>
          </div>

          {/* ─── Error ─── */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ─── Post Data ─── */}
          {post && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  <FileText className="w-4 h-4" />
                  Title
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white break-words">
                  {post.title}
                </p>
              </div>

              {/* Subtitle */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  <Subtitles className="w-4 h-4" />
                  Subtitle
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 break-words">
                  {post.subtitle || "No subtitle"}
                </p>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  <AlignLeft className="w-4 h-4" />
                  Content
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Post ID */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                  <Hash className="w-4 h-4" />
                  Post ID
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-all bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 font-mono">
                  {post._id}
                </p>
              </div>

              {/* ─── Actions ─── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => navigate(`/product/update/${post._id}`)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Post
                </button>

                <button
                  onClick={() => navigate("/product/list")}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Back to List
                </button>
              </div>
            </div>
          )}
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

export default ProductDetails;