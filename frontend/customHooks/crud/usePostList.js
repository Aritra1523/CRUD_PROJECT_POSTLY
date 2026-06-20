
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import endPoints from "../../api/endpoints";

const usePostList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6); // change to whatever you prefer

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(endPoints.auth.list, {
        headers: { "x-access-token": token },
      });
      setProducts(res.data.data || []);
      setCurrentPage(1); // reset to page 1 on fresh fetch
    } catch (err) {
      console.log(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Derived pagination values
  const totalPages = Math.ceil(products.length / postsPerPage);
  const indexOfFirst = (currentPage - 1) * postsPerPage;
  const indexOfLast = indexOfFirst + postsPerPage;
  const currentPosts = products.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    products,
    currentPosts,
    loading,
    error,
    fetchProducts,
    // pagination
    currentPage,
    totalPages,
    postsPerPage,
    goToPage,
  };
};

export default usePostList;
