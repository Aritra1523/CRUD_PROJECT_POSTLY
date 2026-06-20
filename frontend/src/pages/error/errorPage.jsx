import React from "react";
import "./errorPage.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <img
        src="/errorImage.png"
        alt="Unauthorized"
        className="error-image"
      />

      <h1>401 - Unauthorized Access</h1>

      <p>Please login first to access this page.</p>

     <Link to="/auth/login">
        <button className="login-btn">Go To Login</button>
      </Link>
    </div>
  );
};

export default ErrorPage;