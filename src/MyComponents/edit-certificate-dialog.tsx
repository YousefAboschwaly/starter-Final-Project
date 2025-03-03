"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./image-upload";
import { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { UserContext } from "@/Contexts/UserContext";
import { Input } from "@/components/ui/input";
import Alert from "./Alert";

interface EditCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCert: {
    id: number;
    name: string;
    description: string;
    path: string;
  } | null;
  onEdit: (certificate: {
    id: number;
    name: string;
    description: string;
    path: string;
  }) => void;
}

export function EditCertificateDialog({ open, onOpenChange, selectedCert, onEdit }: EditCertificateDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasNewImage, setHasNewImage] = useState<boolean>(false);
  const [certificateName, setCertificateName] = useState<string>("");
  const [certificateDescription, setCertificateDescription] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; show: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }

  const { userToken, pathUrl } = userContext;
  const photoBase_URL = `${pathUrl}/`;

  useEffect(() => {
    if (selectedCert) {
      setCertificateName(selectedCert.name || "");
      setCertificateDescription(selectedCert.description || "");
      const imageUrl = `${photoBase_URL}${encodeURIComponent(selectedCert.path)}`;
      setOriginalPreviewUrl(imageUrl);
      setPreviewUrl(imageUrl);
      setSelectedFile(null);
      setHasNewImage(false);
    }
  }, [selectedCert]);

  const handleFileChange = (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
    if (fileOrEvent instanceof File) {
      setSelectedFile(fileOrEvent);
      setHasNewImage(true);
      const newPreview = URL.createObjectURL(fileOrEvent);
      setPreviewUrl(newPreview);
    } else if (fileOrEvent && fileOrEvent.target && fileOrEvent.target.files) {
      const file = fileOrEvent.target.files[0];
      if (file) {
        setSelectedFile(file);
        setHasNewImage(true);
        const newPreview = URL.createObjectURL(file);
        setPreviewUrl(newPreview);
      } else {
        setSelectedFile(null);
        setHasNewImage(false);
        setPreviewUrl(originalPreviewUrl);
      }
    } else {
      console.error("handleFileChange: Invalid file input");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setHasNewImage(false);
    setPreviewUrl(originalPreviewUrl);
    onOpenChange(false);
  };

  const handleUpdate = useCallback(async () => {
    if (!selectedCert || !userToken) return;

    if (!certificateName.trim() || !certificateDescription.trim()) {
      setAlert({ message: "Certificate name and description are required!", type: 'error', show: true });
      return;
    }

    setLoading(true);
    setAlert(null);

    const certificateData = {
      id: selectedCert.id,
      name: certificateName,
      description: certificateDescription
    };

    const formData = new FormData();
    const certificateBlob = new Blob([JSON.stringify(certificateData)], { type: "application/json" });
    formData.append("certificate", certificateBlob, "certificate.json");

    if (hasNewImage && selectedFile) {
      formData.append("image", selectedFile, selectedFile.name);
    } else if (originalPreviewUrl) {
      try {
        const response = await axios.get(originalPreviewUrl, { responseType: 'blob' });
        formData.append("image", response.data, 'originalImage.jpg');
      } catch (error) {
        setAlert({ message: "Error fetching original image.", type: 'error', show: true });
        setLoading(false);
        return;
      }
    }

    try {
      const response = await axios.put(
        `${pathUrl}/api/v1/certificate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        onEdit({
          id: selectedCert.id,
          name: certificateName,
          description: certificateDescription,
          path: selectedCert.path, // Ensure the path is updated if needed
        });
        onOpenChange(false);
        setSelectedFile(null);
        setHasNewImage(false);
        setCertificateName("");
        setCertificateDescription("");
        setAlert({ message: "Certificate updated successfully!", type: 'success', show: true });
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({ message: "Update failed: " + response.data.message, type: 'error', show: true });
      }
    } catch (error: any) {
      setAlert({ message: "Error updating certificate: " + error.message, type: 'error', show: true });
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }, [
    selectedCert,
    userToken,
    certificateName,
    certificateDescription,
    selectedFile,
    hasNewImage,
    originalPreviewUrl,
    onEdit,
    onOpenChange,
    pathUrl
  ]);

  return (
    <>
      <div className={`fixed inset-0 z-50 backdrop-blur-[2px] ${open ? "block" : "hidden"}`} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Certification</h2>
          </div>

          <div className="mt-4">
            <ImageUpload
              defaultImage={previewUrl ?? undefined}
              onChange={handleFileChange}
              className="w-full max-w-xs rounded-small"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Certificate Name</label>
            <Input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              className="mt-1 p-[5px] block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Certificate Description</label>
            <Input
              value={certificateDescription}
              onChange={(e) => setCertificateDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="bg-white hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-gray-900 hover:bg-gray-800"
              disabled={!certificateName.trim() || !certificateDescription.trim() || loading}
            >
              {loading ? "Updating..." : "Update Certificate"}
            </Button>
          </div>

          {alert && alert.show && (
            <Alert
              message={alert.message}
              type={alert.type}
              isVisible={alert.show}
              onClose={() => setAlert(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
