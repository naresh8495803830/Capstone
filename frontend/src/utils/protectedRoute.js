// src/ProtectedRoute.js
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element: Component, ...rest }) {
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn);
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
