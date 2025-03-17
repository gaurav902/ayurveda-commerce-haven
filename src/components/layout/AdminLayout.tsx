
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only navigate if not loading and we have determined the admin status
    if (!isLoading) {
      if (!user) {
        toast.error("Please log in to access admin features");
        navigate("/login");
      } else if (!isAdmin) {
        toast.error("You don't have admin privileges");
        navigate("/");
      }
    }
  }, [isLoading, isAdmin, user, navigate]);

  // Redirect non-admin users or handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 p-4 hidden md:block">
        <AdminSidebar />
      </div>
      <div className="flex-1 md:ml-64 md:pl-0 p-0">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
