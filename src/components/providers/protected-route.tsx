import React from "react";
import { Navigate } from "react-router-dom";

import { getToken, TOKEN_ID } from "@/lib/queries/token";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const apiUrl = getToken(TOKEN_ID.API_URL);
  const token = getToken(TOKEN_ID.TOKEN);

  if (!apiUrl || !token) {
    return <Navigate to="/manager/login" />;
  }

  return children;
};

export default ProtectedRoute;
