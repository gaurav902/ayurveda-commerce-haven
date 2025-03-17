
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users or handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/login");
    return null;
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
