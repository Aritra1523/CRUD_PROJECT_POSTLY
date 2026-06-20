import { useState } from "react";
import axiosInstance from "../../api/axios";

export const useLoginApi = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postData = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(url, payload);
            setData(response.data);
            console.log(response.data);

        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, postData };
};

