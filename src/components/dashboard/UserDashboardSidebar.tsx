
import { Link, useLocation } from "react-router-dom";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  LogOut, 
  Settings,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

const UserDashboardSidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Profile", icon: <User size={18} />, path: "/dashboard" },
    { name: "Orders", icon: <ShoppingBag size={18} />, path: "/dashboard/orders" },
    { name: "Wishlist", icon: <Heart size={18} />, path: "/dashboard/wishlist" },
    { name: "Checkups", icon: <FileCheck size={18} />, path: "/dashboard/checkups" },
    { name: "Addresses", icon: <MapPin size={18} />, path: "/dashboard/addresses" },
    { name: "Payment Methods", icon: <CreditCard size={18} />, path: "/dashboard/payment-methods" },
    { name: "Account Settings", icon: <Settings size={18} />, path: "/dashboard/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear authentication and redirect
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <div className="bg-ayurveda-cream/50 rounded-lg p-6 h-full">
      <div className="mb-6">
        <h3 className="font-serif text-xl mb-1">My Account</h3>
        <p className="text-sm text-muted-foreground">Manage your account details</p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-md transition-colors ${
              isActive(item.path)
                ? "bg-primary text-white"
                : "text-foreground hover:bg-ayurveda-cream"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="mt-10 pt-6 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center text-destructive border-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserDashboardSidebar;
