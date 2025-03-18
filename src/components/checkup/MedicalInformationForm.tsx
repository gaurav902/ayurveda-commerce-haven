
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface MedicalInformationFormProps {
  formData: {
    bloodGroup: string;
    allergies: string;
    birthmarks: string;
    medicalConditions: string;
    previousTreatments: string;
    currentMedications: string;
  };
  updateFormData: (data: Partial<MedicalInformationFormProps["formData"]>) => void;
  onReportUpload: (file: File | null) => void;
}

const MedicalInformationForm = ({ 
  formData, 
  updateFormData, 
  onReportUpload 
}: MedicalInformationFormProps) => {
  const [reportFile, setReportFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReportFile(file);
    onReportUpload(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Medical Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group *</Label>
          <select
            id="bloodGroup"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.bloodGroup}
            onChange={(e) => updateFormData({ bloodGroup: e.target.value })}
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies *</Label>
          <Textarea
            id="allergies"
            placeholder="List any allergies you have (or type 'None')"
            value={formData.allergies}
            onChange={(e) => updateFormData({ allergies: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthmarks">Birthmarks or Distinguishing Marks</Label>
          <Textarea
            id="birthmarks"
            placeholder="Describe any birthmarks or distinguishing marks"
            value={formData.birthmarks}
            onChange={(e) => updateFormData({ birthmarks: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medicalConditions">Existing Medical Conditions *</Label>
          <Textarea
            id="medicalConditions"
            placeholder="List any medical conditions you have (or type 'None')"
            value={formData.medicalConditions}
            onChange={(e) => updateFormData({ medicalConditions: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="previousTreatments">Previous Skin/Hair Treatments</Label>
          <Textarea
            id="previousTreatments"
            placeholder="List any previous treatments you've had"
            value={formData.previousTreatments}
            onChange={(e) => updateFormData({ previousTreatments: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentMedications">Current Medications</Label>
          <Textarea
            id="currentMedications"
            placeholder="List any medications you're currently taking"
            value={formData.currentMedications}
            onChange={(e) => updateFormData({ currentMedications: e.target.value })}
          />
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <Label htmlFor="reportUpload">Upload Medical Reports (PDF/PNG) *</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <input
            id="reportUpload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="reportUpload" className="cursor-pointer block">
            <Upload className="h-10 w-10 mx-auto text-gray-500 mb-2" />
            <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">PDF, PNG, JPG or JPEG (max. 10MB)</p>
          </label>
          {reportFile && (
            <div className="mt-4 p-2 bg-green-50 text-green-700 rounded flex items-center justify-center">
              <span className="truncate max-w-full block">{reportFile.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalInformationForm;
