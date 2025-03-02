"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./file-upload";
import { useState, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "@/Contexts/UserContext"
import { Input } from "@/components/ui/input";


interface AddCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (certificate: {
    id: number;
    name: string;
    description: string;
    path: string;
  }) => void;
}

export function AddCertificateDialog({ open, onOpenChange, onAdd }: AddCertificateDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [certificateName, setCertificateName] = useState<string>("");
  const [certificateDescription, setCertificateDescription] = useState<string>("");
   
  let user_type = localStorage.getItem("user-type");
     // Ensure user_type is a valid string before replacing spaces
    user_type = user_type ? user_type.replace(/\s+/g, "-") : null;
    const userContext = useContext(UserContext)
    if (!userContext) {
      throw new Error("UserContext must be used within a UserContextProvider")
    }
    const {  userToken, pathUrl } = userContext

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]); // Store the selected file
    } else {
      setSelectedFile(null); // Clear the selected file if no file is chosen
    }
  };

 
  //Add Certifications
  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError("No file selected!");
      return;
    }

    if (!certificateName.trim() || !certificateDescription.trim()) {
      setError("Certificate name and description are required!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    const certificateBlob = new Blob([JSON.stringify({
      name: certificateName,
      description: certificateDescription
    })], { type: "application/json" });

    formData.append("certificate", certificateBlob, "certificate.json");
    formData.append("image", selectedFile, selectedFile.name);

    // Log the form data being sent
    console.log("FormData being sent:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await axios.post(
        `${pathUrl}/api/v1/certificate`,

        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log the response data
      console.log("Response data:", response.data);

      if (response.data.success) {
        const uploadedCertificate = {
          id: response.data.data.id,
          name: response.data.data.name,
          description: response.data.data.description,
          path: response.data.data.path,
        };

        onAdd(uploadedCertificate);
        onOpenChange(false); // Close the dialog after successful upload
        setSelectedFile(null);
        setCertificateName("");
        setCertificateDescription("");
      } else {
        setError("Upload failed: " + response.data.message);
      } 
    }catch (error) {
      if (axios.isAxiosError(error)) {
        setError("Error uploading file: " + (error.response?.data?.message || error.message));
        console.error("Axios error details:", error.response?.data);
      } else {
        setError("An unexpected error occurred: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    } 
    finally {
      setLoading(false);
    }
  }, [selectedFile, certificateName, certificateDescription, userToken, onAdd, onOpenChange]);

  return (
   <>
   <>
      <div className={`fixed inset-0 z-50 backdrop-blur-[2px] ${open ? "block" : "hidden"}`} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Certifications</h2>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-6">
            <FileUpload
              maxFiles={1}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              value={selectedFile ? [selectedFile] : []}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Certificate Name</label>
            <Input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              className="mt-1 p-[5px] block w-full border border-gray-300 rounded-md shadow-sm  sm:text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Certificate Description</label>
            <Input
              value={certificateDescription}
              onChange={(e) => setCertificateDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm  sm:text-sm"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="bg-white hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="bg-gray-900 hover:bg-gray-800"
              disabled={!selectedFile || !certificateName.trim() || !certificateDescription.trim() || loading}
            >
              {loading ? "Uploading..." : "Upload Certificate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
   </>
  );
}




