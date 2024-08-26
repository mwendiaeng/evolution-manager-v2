import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const apiUrl = localStorage.getItem("apiUrl");
  const token = localStorage.getItem("token");
  const version = localStorage.getItem("version");

  if (!apiUrl || !token || !version) {
    return <Navigate to="/manager/login" />;
  }

  return children;
};

export default ProtectedRoute;
