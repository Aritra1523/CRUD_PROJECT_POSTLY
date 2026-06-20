import React from "react";
import { Navigate } from "react-router-dom";

import Swal from "sweetalert2";

const CheckPrivateRouting = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Sorry",
      text: "Please login first",
    });
    return <Navigate to="/errorpage" />;
  }

  return children;
};

export default CheckPrivateRouting;
