import { useState } from "react";
import axiosInstance from "../../api/axios";
import endPoints from "../../api/endpoints";
import { toast } from "sonner";
const useAddPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addPost = async (data) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        endPoints.auth.add,
        data,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      return res.data;
      toast.success(response.data.message)
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Post create failed"
      );
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  return {
    addPost,
    loading,
    error,
  };
};

export default useAddPost;