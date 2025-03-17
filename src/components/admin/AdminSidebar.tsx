
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  BarChart, 
  Tag, 
  LogOut,
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin/dashboard" },
    { name: "Products", icon: <Package size={18} />, path: "/admin/products" },
    { name: "Categories", icon: <Tag size={18} />, path: "/admin/categories" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/admin/orders" },
    { name: "Blog", icon: <FileText size={18} />, path: "/admin/blogs" },
    { name: "Customers", icon: <Users size={18} />, path: "/admin/customers" },
    { name: "Analytics", icon: <BarChart size={18} />, path: "/admin/analytics" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== "/admin/dashboard" && location.pathname.startsWith(path));
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="bg-primary/95 text-white rounded-lg p-6 h-full">
      <div className="mb-6">
        <h3 className="font-serif text-xl mb-1">Admin Panel</h3>
        <p className="text-sm text-white/70">Manage your store</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${
              isActive(item.path)
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="mt-10 pt-6 border-t border-white/20">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center bg-transparent text-white border-white/30 hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
