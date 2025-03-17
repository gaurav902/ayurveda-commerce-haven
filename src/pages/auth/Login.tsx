
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Eye, EyeOff, User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("user");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAdmin } = useAuth();

  // Get the redirect path from location state, or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    // For admin login, auto-fill admin credentials if selected
    const loginEmail = loginType === "admin" ? "admin@tellmeindia.com" : email;
    const loginPassword = loginType === "admin" ? "admin123" : password;
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (!error) {
      // Wait a moment for auth state to update
      setTimeout(() => {
        // Redirect based on role
        if (isAdmin) {
          navigate("/admin/dashboard");
        } else {
          // Redirect to the page they were trying to access or home
          navigate(from);
        }
      }, 500);
    }
    
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAdminLogin = () => {
    setLoginType("admin");
    setEmail("admin@tellmeindia.com");
    setPassword("admin123");
  };

  const handleUserLogin = () => {
    setLoginType("user");
    setEmail("");
    setPassword("");
  };

  return (
    <Layout>
      <div className="container max-w-md py-12">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-serif">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="user" className="w-full" onValueChange={(value) => value === "admin" ? handleAdminLogin() : handleUserLogin()}>
            <TabsList className="grid grid-cols-2 mb-4 mx-6">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User size={16} />
                <span>User Login</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Admin Login</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                      Register
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                    <p className="text-sm text-amber-800">Admin login credentials are pre-filled. Click Login to continue.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary-900 hover:bg-primary-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login as Admin"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
