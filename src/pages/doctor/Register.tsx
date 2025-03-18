
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Eye, EyeOff, Stethoscope, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    hospital: "",
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLicenseFile(file);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licenseFile) {
      toast.error("Please upload your medical license");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error("Failed to create account");
      }
      
      // Upload license file
      let licenseUrl = "";
      if (licenseFile) {
        const fileName = `${data.user.id}/${Date.now()}-license.${licenseFile.name.split('.').pop()}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('doctor-licenses')
          .upload(fileName, licenseFile);
          
        if (fileError) throw fileError;
        licenseUrl = fileData?.path || "";
      }
      
      // Create doctor profile
      const { error: profileError } = await supabase
        .from('doctors')
        .insert({
          id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          license_number: formData.licenseNumber,
          license_url: licenseUrl,
          hospital: formData.hospital,
          status: 'pending',
        });
        
      if (profileError) throw profileError;
      
      toast.success("Registration submitted for review");
      navigate("/doctor/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-12">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-serif">Doctor Registration</CardTitle>
            <CardDescription className="text-center">
              Create an account to join as a skin and hair specialist
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
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
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Dermatologist, Trichologist"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Medical License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clinic</Label>
                  <Input
                    id="hospital"
                    placeholder="Where you currently practice"
                    value={formData.hospital}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="licenseUpload">Upload License/Certification (PDF/Image)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      id="licenseUpload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="licenseUpload" className="cursor-pointer block">
                      <Upload className="h-10 w-10 mx-auto text-gray-500 mb-2" />
                      <p className="text-sm text-gray-500 mb-1">Click to upload your medical license</p>
                      <p className="text-xs text-gray-400">PDF, PNG, JPG or JPEG (max. 10MB)</p>
                    </label>
                    {licenseFile && (
                      <div className="mt-4 p-2 bg-green-50 text-green-700 rounded flex items-center justify-center">
                        <span className="truncate max-w-full block">{licenseFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md mt-4 text-sm text-yellow-800">
                <p><strong>Note:</strong> Your registration will be reviewed by our admin team before you can access the system. This typically takes 1-2 business days.</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Register as Doctor"}
              </Button>
              <Button 
                type="button" 
                variant="link" 
                className="text-sm"
                onClick={() => navigate("/doctor/login")}
              >
                Already have an account? Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorRegister;
