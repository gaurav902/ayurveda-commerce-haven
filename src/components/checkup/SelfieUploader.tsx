
import { useState, useRef } from "react";
import { Camera, CheckCircle2, Info, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SelfieUploaderProps {
  selfies: File[];
  onSelfieUpload: (files: File[]) => void;
}

const REQUIRED_POSES = [
  { name: "Front view", description: "Look directly at the camera with a neutral expression" },
  { name: "Left side", description: "Turn your head to show the left side of your face" },
  { name: "Right side", description: "Turn your head to show the right side of your face" },
  { name: "Top view", description: "Tilt your head down to show your scalp/hair" }
];

const SelfieUploader = ({ selfies, onSelfieUpload }: SelfieUploaderProps) => {
  const [currentSelfie, setCurrentSelfie] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast.error("Please upload only image files");
      return;
    }

    const largeFiles = files.filter(file => file.size > 5 * 1024 * 1024); // 5MB
    if (largeFiles.length > 0) {
      toast.error("One or more files exceed the 5MB limit");
      return;
    }

    // Add new files to existing selfies (up to 5)
    const updatedSelfies = [...selfies];
    files.forEach(file => {
      if (updatedSelfies.length < 5) {
        updatedSelfies.push(file);
      }
    });

    onSelfieUpload(updatedSelfies);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeSelfie = (index: number) => {
    const updatedSelfies = [...selfies];
    updatedSelfies.splice(index, 1);
    onSelfieUpload(updatedSelfies);
    setCurrentSelfie(null);
  };

  const viewSelfie = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentSelfie(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Selfie Uploads (4-5 Photos Required)</h3>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">How to take proper photos for assessment</h4>
            <ul className="list-disc list-inside mt-2 text-sm text-blue-700 space-y-1">
              {REQUIRED_POSES.map((pose, index) => (
                <li key={index}>
                  <span className="font-medium">{pose.name}:</span> {pose.description}
                </li>
              ))}
              <li>Use good lighting with no filters</li>
              <li>Remove makeup, glasses, or anything covering your skin</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center h-64 flex flex-col items-center justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="selfieUpload"
            />
            {selfies.length < 5 ? (
              <label htmlFor="selfieUpload" className="cursor-pointer block">
                <Camera className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                <p className="text-sm text-gray-500 mb-1">Click to upload selfies</p>
                <p className="text-xs text-gray-400">PNG, JPG or JPEG (max. 5MB per image)</p>
              </label>
            ) : (
              <div className="text-sm text-gray-500">
                Maximum 5 selfies allowed. Remove some to add more.
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              {selfies.length} of 5 photos uploaded ({selfies.length >= 4 ? "✅ Minimum met" : "❌ Need at least 4"})
            </p>
            <div className="flex flex-wrap gap-2">
              {selfies.map((file, index) => (
                <div 
                  key={index} 
                  className="relative border rounded-md overflow-hidden group cursor-pointer"
                  style={{ width: '80px', height: '80px' }}
                  onClick={() => viewSelfie(file)}
                >
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Selfie ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelfie(index);
                      }}
                      className="text-white"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border rounded-md p-4 h-full flex flex-col">
          <h4 className="font-medium mb-2">Photo Preview</h4>
          <div className="bg-gray-100 rounded-md flex-1 flex items-center justify-center">
            {currentSelfie ? (
              <img 
                src={currentSelfie} 
                alt="Selected selfie" 
                className="max-w-full max-h-full rounded"
              />
            ) : (
              <p className="text-gray-500 text-sm">Click on a photo to preview it here</p>
            )}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>Make sure your photos clearly show:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Face from different angles</li>
              <li>Any problem areas</li>
              <li>Natural lighting without filters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfieUploader;
