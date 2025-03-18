
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import DoctorLayout from "@/components/layout/DoctorLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckupApplication } from "@/types";

const RecommendKit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState<CheckupApplication | null>(null);
  const [kitRecommendation, setKitRecommendation] = useState({
    diagnosis: "",
    products: [
      { name: "", description: "", usage: "" }
    ],
    additional_notes: "",
    require_followup: false,
  });

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('checkup_applications')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setApplication(data);
      } catch (error: any) {
        console.error("Error fetching application:", error);
        toast.error("Failed to load application");
        navigate("/doctor/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplication();
  }, [id, navigate]);

  const updateKitProduct = (index: number, field: string, value: string) => {
    const updatedProducts = [...kitRecommendation.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    setKitRecommendation({
      ...kitRecommendation,
      products: updatedProducts
    });
  };

  const addProduct = () => {
    setKitRecommendation({
      ...kitRecommendation,
      products: [
        ...kitRecommendation.products,
        { name: "", description: "", usage: "" }
      ]
    });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...kitRecommendation.products];
    updatedProducts.splice(index, 1);
    setKitRecommendation({
      ...kitRecommendation,
      products: updatedProducts
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!application) return;
    
    // Validate
    if (!kitRecommendation.diagnosis.trim()) {
      toast.error("Please provide a diagnosis");
      return;
    }
    
    if (kitRecommendation.products.some(p => !p.name.trim() || !p.description.trim())) {
      toast.error("Please fill in all product details");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Save kit recommendation
      const { error: recommendError } = await supabase
        .from('kit_recommendations')
        .insert({
          application_id: application.id,
          diagnosis: kitRecommendation.diagnosis,
          products: kitRecommendation.products,
          additional_notes: kitRecommendation.additional_notes,
          require_followup: kitRecommendation.require_followup,
        });
        
      if (recommendError) throw recommendError;
      
      // Update application status
      const { error: updateError } = await supabase
        .from('checkup_applications')
        .update({ status: 'completed' })
        .eq('id', application.id);
        
      if (updateError) throw updateError;
      
      toast.success("Kit recommendation submitted successfully");
      navigate("/doctor/dashboard");
    } catch (error: any) {
      console.error("Error submitting recommendation:", error);
      toast.error(`Failed to submit recommendation: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DoctorLayout>
        <div className="container py-6 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DoctorLayout>
    );
  }

  if (!application) {
    return (
      <DoctorLayout>
        <div className="container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Not Found</CardTitle>
              <CardDescription>
                The requested checkup application could not be found.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/doctor/dashboard")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Recommend Treatment Kit</h1>
          <Button variant="outline" onClick={() => navigate(`/doctor/application/${id}`)}>
            View Full Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{application.full_name}</p>
              <p className="text-sm text-muted-foreground">{application.age} years, {application.gender}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Skin Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{application.skin_problem}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Hair Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{application.hair_problem}</p>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Professional Assessment</CardTitle>
              <CardDescription>
                Provide your diagnosis and treatment plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    value={kitRecommendation.diagnosis}
                    onChange={(e) => setKitRecommendation({
                      ...kitRecommendation,
                      diagnosis: e.target.value
                    })}
                    placeholder="Provide your diagnosis based on the patient's symptoms and photos"
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recommended Products</CardTitle>
              <CardDescription>
                Specify the products for the personalized kit
              </CardDescription>
            </CardHeader>
            <CardContent>
              {kitRecommendation.products.map((product, index) => (
                <div key={index} className="p-4 border rounded-md mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Product {index + 1}</h3>
                    {kitRecommendation.products.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeProduct(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`product-name-${index}`}>Product Name</Label>
                      <Input
                        id={`product-name-${index}`}
                        value={product.name}
                        onChange={(e) => updateKitProduct(index, 'name', e.target.value)}
                        placeholder="e.g., Advanced Hair Serum"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`product-description-${index}`}>Description</Label>
                      <Textarea
                        id={`product-description-${index}`}
                        value={product.description}
                        onChange={(e) => updateKitProduct(index, 'description', e.target.value)}
                        placeholder="What the product does and its key ingredients"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`product-usage-${index}`}>Usage Instructions</Label>
                      <Textarea
                        id={`product-usage-${index}`}
                        value={product.usage}
                        onChange={(e) => updateKitProduct(index, 'usage', e.target.value)}
                        placeholder="How to use the product, frequency, etc."
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addProduct}
                className="w-full"
              >
                Add Another Product
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="additional_notes">Additional Notes & Recommendations</Label>
                  <Textarea
                    id="additional_notes"
                    value={kitRecommendation.additional_notes}
                    onChange={(e) => setKitRecommendation({
                      ...kitRecommendation,
                      additional_notes: e.target.value
                    })}
                    placeholder="Any lifestyle changes, dietary advice, or other recommendations"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require_followup"
                    checked={kitRecommendation.require_followup}
                    onCheckedChange={(checked) => setKitRecommendation({
                      ...kitRecommendation,
                      require_followup: checked as boolean
                    })}
                  />
                  <Label htmlFor="require_followup">
                    Patient should schedule a follow-up consultation
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/doctor/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Recommendation"}
            </Button>
          </div>
        </form>
      </div>
    </DoctorLayout>
  );
};

export default RecommendKit;
