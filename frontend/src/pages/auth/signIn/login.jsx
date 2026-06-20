import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginCom } from "../../../components/authCom/loginCom";
// import "./Login.css";
import endPoints from "../../../../api/endpoints";
import { useLoginApi } from "../../../../customHooks/authhooks/auth.login";
import Swal from "sweetalert2";
export default function Login() {
  const {
    loading,
    postData,
    error: apiError,
    data,
  } = useLoginApi(endPoints.auth.login);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const showAlert = async () => {
      if (data?.status) {
        localStorage.setItem("token", data.token);

        // localStorage.setItem("userId", data.user.id);

        const result = await Swal.fire({
          title: "Login Successful!",
          text: "Welcome Back",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (result.isConfirmed) {
          navigate("/product/list", {
            state: { userId: data.user.id },
          });
        }
      }
    };

    showAlert();
  }, [data]);

  const validate = () => {
    let error = {};

    if (!user.email.trim()) error.email = "email is required";
    if (!user.password.trim()) error.password = "password is required";

    return error;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "email") {
      if (value.length === 0) {
        setError((prev) => ({ ...prev, email: "email is required" }));
        setUser({ ...user, email: "" });
      } else {
        setError((prev) => ({ ...prev, email: "" }));
        setUser({ ...user, email: value });
      }
    }

    if (name === "password") {
      if (value.length === 0) {
        setError((prev) => ({ ...prev, password: "password is required" }));
        setUser({ ...user, password: "" });
      } else {
        setError((prev) => ({ ...prev, password: "" }));
        setUser({ ...user, password: value });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    postData(user);
  };

  return (
    <div className="container">
      <LoginCom
        handleSubmit={handleSubmit}
        apiError={apiError}
        user={user}
        handleChange={handleChange}
        error={error}
        loading={loading}
      />
    </div>
  );
}
