import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./Register.css";
import { useRegisterApi } from "../../../../customHooks/authhooks/auth.register";
import RegisterCom from "../../../components/authCom/registerCom";
import endPoints from "../../../../api/endpoints";
import Swal from "sweetalert2";

export default function Register() {
  const {
    loading,
    postData,
    error: apiError,
    data,
  } = useRegisterApi(endPoints.auth.register);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState({});
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const showAlert = async () => {
      if (data?.status) {
        const result = await Swal.fire({
          title: "OTP Sent!",
          text: "Please verify your email OTP",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (result.isConfirmed) {
          navigate("/auth/verify-otp", {
            state: {
              userId: data.user.id,
            },
          });
        }
      }
    };

    showAlert();
  }, [data]);

  const validate = () => {
    let error = {};

    if (!user.name.trim()) error.name = "name is required";
    if (!user.email.trim()) error.email = "email is required";
    if (!user.password.trim()) error.password = "password is required";
    if (!user.address.trim()) error.address = "address is required";

    if (!user.confirmPassword.trim()) {
      error.confirmPassword = "confirm password is required";
    } else if (user.password !== user.confirmPassword) {
      error.confirmPassword = "passwords do not match";
    }

    if (!profileImage) error.profileImage = "profile image is required";

    return error;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "name") {
      if (value.length === 0) {
        setError((prev) => ({ ...prev, name: "name is required" }));
        setUser({ ...user, name: "" });
      } else {
        setError((prev) => ({ ...prev, name: "" }));
        setUser({ ...user, name: value });
      }
    }

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

    if (name === "confirmPassword") {
      if (value.length === 0) {
        setError((prev) => ({
          ...prev,
          confirmPassword: "confirm password is required",
        }));
        setUser({ ...user, confirmPassword: "" });
      } else {
        const updatedUser = { ...user, confirmPassword: value };
        setUser(updatedUser);

        if (value !== updatedUser.password) {
          setError((prev) => ({
            ...prev,
            confirmPassword: "passwords do not match",
          }));
        } else {
          setError((prev) => ({ ...prev, confirmPassword: "" }));
        }
      }
    }

    if (name === "address") {
      if (value.length === 0) {
        setError((prev) => ({ ...prev, address: "address is required" }));
        setUser({ ...user, address: "" });
      } else {
        setError((prev) => ({ ...prev, address: "" }));
        setUser({ ...user, address: value });
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    setError((prev) => ({
      ...prev,
      profileImage: file ? "" : "profile image is required",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("confirmPassword", user.confirmPassword);
    formData.append("address", user.address);
    formData.append("profileImage", profileImage);

    postData(formData);
  };

  return (
    <div className="container">
      <RegisterCom
        handleSubmit={handleSubmit}
        apiError={apiError}
        user={user}
        handleChange={handleChange}
        error={error}
        loading={loading}
        handleImageChange={handleImageChange}
      />
    </div>
  );
}
