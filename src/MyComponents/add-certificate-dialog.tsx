"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./file-upload";

interface AddCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (file: File) => void;
}

export function AddCertificateDialog({ open, onOpenChange, onAdd }: AddCertificateDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]); // Store the selected file
    } else {
      setSelectedFile(null); // Clear the selected file if no file is chosen
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onAdd(selectedFile); // Pass the selected file to the parent
      onOpenChange(false); // Close the dialog
      setSelectedFile(null); // Reset the selected file
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 backdrop-blur-[2px] ${open ? "block" : "hidden"}`} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Certifications</h2>
          </div>

          <div className="mt-6">
            <FileUpload
              maxFiles={1}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              value={selectedFile ? [selectedFile] : []}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="bg-white hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="bg-gray-900 hover:bg-gray-800"
              disabled={!selectedFile} // Disable the button if no file is selected
            >
              Upload Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}