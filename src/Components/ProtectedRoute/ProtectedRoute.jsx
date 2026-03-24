import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");

  if (!role || !allowedRoles.includes(role)) {
    alert("Try to login Dashboard");
    return <Navigate to="/attendance" />; // redirect
  }

  return children;
}

export default ProtectedRoute;