import React from "react";
import { Navigate } from "react-router-dom";

type PublicRouteProps = {
  children: React.ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const apiUrl = localStorage.getItem("apiUrl");
  const token = localStorage.getItem("token");
  const version = localStorage.getItem("version");

  if (apiUrl && token && version) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
