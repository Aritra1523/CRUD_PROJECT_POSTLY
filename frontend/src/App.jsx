import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Component, lazy, Suspense } from "react";
import VerifyOTP from "./pages/auth/otp/verifyotp";
import PostList from "./pages/crud/postList/postList";
import ProductAdd from "./pages/crud/post_add/ProductAdd";
import ProductUpdate from "./pages/crud/product_Update/productUpdate";
import CheckPrivateRouting from "./routes/checkPrivateRouting";
import ErrorPage from "./pages/error/errorPage";
import ForgotPassword from "./pages/crud/forgetPassword/ForgetPassword";
import ProductDetails from "./pages/crud/productDetails/ProductDetails";
import Profile from "./pages/crud/profile/profile";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import OrderHistoryPage from "./pages/OrderHistoryPage/OrderHistoryPage";
const Register = lazy(() => import("./pages/auth/signUp/register"));
const Login = lazy(() => import("./pages/auth/signIn/login"));

function App() {
  const publicRoute = [
    {
      path: "/",
      component: <Register />,
    },
    {
      path: "/auth/login",
      component: <Login />,
    },
    {
      path: "/auth/verify-otp",
      component: <VerifyOTP />,
    },
    {
      path: "/forget-password",
      component: <ForgotPassword />,
    },
    {
      path: "/auth/reset-password/:id/:token",
      component: <ResetPassword />,
    },
    {
      path: "/errorpage",
      component: <ErrorPage />,
    },
  ];
  const privateAdd = [
    {
      path: "/product/list",
      component: <PostList />,
    },
    {
      path: "/product/create",
      component: <ProductAdd />,
    },
    {
      path: "/product/update/:id",
      component: <ProductUpdate />,
    },
    {
      path: "/product/details/:id",
      component: <ProductDetails />,
    },
    {
      path: "/profile",
      component: <Profile />,
    },
    {
      path: "/cart",
      component: <CartPage />,
    },
    {
      path: "/checkout",
      component: <CheckoutPage />,
    },
    {
      path: "/orders",
      component: <OrderHistoryPage />,
    },
    {
      path: "*",
      component: <ErrorPage />,
    },
  ];

  return (
    <>
      <Suspense fallback={<h4> Loading.... </h4>}>
        <BrowserRouter>
          <Routes>
            {publicRoute.map((item) => {
              return <Route path={item.path} element={item.component} />;
            })}
            {privateAdd.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  element={
                    <CheckPrivateRouting>{item.component}</CheckPrivateRouting>
                  }
                />
              );
            })}
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

export default App;
