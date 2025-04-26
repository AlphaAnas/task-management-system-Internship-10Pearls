
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface RouteGuardProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectPath?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  requireAuth = true,
  requireAdmin = false,
  redirectPath = "/login",
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show nothing while authentication state is loading
  if (isLoading) {
    return null;
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If admin role is required and user is not an admin, redirect to dashboard
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but on login/register, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  // If user is authenticated and meets all requirements, show the protected content
  if (requireAuth) {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  }
  
  // For public routes that don't need the dashboard layout
  return <Outlet />;
};

export default RouteGuard;
