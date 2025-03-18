
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MedicalInformationForm from "@/components/checkup/MedicalInformationForm";
import SelfieUploader from "@/components/checkup/SelfieUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApplyForCheckup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    birthmarks: "",
    medicalConditions: "",
    previousTreatments: "",
    currentMedications: "",
    skinProblem: "",
    hairProblem: "",
    wantConsultation: false
  });
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [selfies, setSelfies] = useState<File[]>([]);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleReportUpload = (file: File | null) => {
    setReportFile(file);
  };

  const handleSelfieUpload = (files: File[]) => {
    setSelfies(files);
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.age || !formData.gender) {
        toast.error("Please fill all personal details");
        return false;
      }
    } else if (step === 2) {
      if (!formData.bloodGroup || !formData.allergies || !formData.medicalConditions) {
        toast.error("Please fill all medical information");
        return false;
      }
      if (!reportFile) {
        toast.error("Please upload your medical report");
        return false;
      }
    } else if (step === 3) {
      if (selfies.length < 4) {
        toast.error("Please upload at least 4 selfies");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit your application");
      navigate("/login");
      return;
    }
    
    if (!validateStep(3) || !formData.skinProblem || !formData.hairProblem) {
      toast.error("Please describe your skin and hair problems");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload medical report
      let reportUrl = "";
      if (reportFile) {
        const reportFileName = `${user.id}/${Date.now()}-report.${reportFile.name.split('.').pop()}`;
        const { data: reportData, error: reportError } = await supabase.storage
          .from('checkup-reports')
          .upload(reportFileName, reportFile);
          
        if (reportError) throw reportError;
        reportUrl = reportData?.path || "";
      }
      
      // Upload selfies
      const selfieUrls: string[] = [];
      for (const selfie of selfies) {
        const selfieFileName = `${user.id}/${Date.now()}-selfie-${selfieUrls.length}.${selfie.name.split('.').pop()}`;
        const { data: selfieData, error: selfieError } = await supabase.storage
          .from('checkup-selfies')
          .upload(selfieFileName, selfie);
          
        if (selfieError) throw selfieError;
        if (selfieData?.path) selfieUrls.push(selfieData.path);
      }
      
      // Save checkup application
      const { error: insertError } = await supabase
        .from('checkup_applications')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          gender: formData.gender,
          blood_group: formData.bloodGroup,
          allergies: formData.allergies,
          birthmarks: formData.birthmarks,
          medical_conditions: formData.medicalConditions,
          previous_treatments: formData.previousTreatments,
          current_medications: formData.currentMedications,
          skin_problem: formData.skinProblem,
          hair_problem: formData.hairProblem,
          want_consultation: formData.wantConsultation,
          report_url: reportUrl,
          selfie_urls: selfieUrls,
          status: 'pending'
        });
        
      if (insertError) throw insertError;
      
      toast.success("Your application has been submitted successfully!");
      setFormComplete(true);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(`Failed to submit application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formComplete) {
    return (
      <Layout>
        <div className="container py-10">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Application Submitted!</CardTitle>
              <CardDescription className="text-center">
                Thank you for applying for a free skin and hair checkup. Our professionals will review your application and contact you soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="p-4 bg-green-50 text-green-700 rounded-md mb-4 w-full text-center">
                Your application has been received and is under review.
              </div>
              <Button onClick={() => navigate("/")}>Return to Homepage</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Free Skin & Hair Checkup Application</CardTitle>
            <CardDescription className="text-center">
              Complete the form below to apply for a free professional assessment and get a personalized kit recommendation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 flex justify-center">
              <div className="flex space-x-2 items-center">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div 
                      className={`rounded-full w-8 h-8 flex items-center justify-center ${
                        step === currentStep ? "bg-primary text-white" : 
                          step < currentStep ? "bg-green-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    {step < 4 && <div className={`h-1 w-10 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`} />}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={(e) => updateFormData({ fullName: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => updateFormData({ email: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={(e) => updateFormData({ phone: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        min="0" 
                        value={formData.age} 
                        onChange={(e) => updateFormData({ age: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <div className="flex space-x-4">
                        {["Male", "Female", "Other"].map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="gender" 
                              value={option} 
                              checked={formData.gender === option}
                              onChange={() => updateFormData({ gender: option })}
                              className="h-4 w-4 text-primary"
                              required
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <MedicalInformationForm 
                  formData={formData} 
                  updateFormData={updateFormData} 
                  onReportUpload={handleReportUpload}
                />
              )}

              {currentStep === 3 && (
                <SelfieUploader 
                  selfies={selfies} 
                  onSelfieUpload={handleSelfieUpload} 
                />
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Problem Description & Consultation</h3>
                  <div className="space-y-2">
                    <Label htmlFor="skinProblem">Describe your skin problem in detail *</Label>
                    <Textarea 
                      id="skinProblem" 
                      value={formData.skinProblem} 
                      onChange={(e) => updateFormData({ skinProblem: e.target.value })} 
                      placeholder="Please describe your skin concerns, when they started, any triggers, etc."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hairProblem">Describe your hair problem in detail *</Label>
                    <Textarea 
                      id="hairProblem" 
                      value={formData.hairProblem} 
                      onChange={(e) => updateFormData({ hairProblem: e.target.value })} 
                      placeholder="Please describe your hair concerns, hair fall pattern, scalp issues, etc."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="wantConsultation" 
                      checked={formData.wantConsultation}
                      onCheckedChange={(checked) => updateFormData({ wantConsultation: checked as boolean })}
                    />
                    <Label htmlFor="wantConsultation" className="cursor-pointer">
                      I would like to book a call with a professional
                    </Label>
                  </div>
                  <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md mt-4">
                    <p>By submitting this form, you agree that a professional will review your information and recommend a personalized kit for your needs.</p>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleSubmit} 
                className="ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplyForCheckup;
