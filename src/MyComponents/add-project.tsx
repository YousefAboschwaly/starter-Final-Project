"use client"
import { useContext, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import ConfirmDialog from "../MyComponents/dialog"
import ProjectForm, { type IFormData } from "./project-form"
import axios from "axios"
import { UserContext } from "@/Contexts/UserContext"

interface AddProjectProps {
  onClose: () => void
}

export default function AddProject({ onClose }: AddProjectProps) {

    const userContext = useContext(UserContext);
    if (!userContext) {
      throw new Error("UserContext must be used within a UserContextProvider");
    }
    const { pathUrl } = userContext;
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingData, setPendingData] = useState<IFormData | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (formData: IFormData) => {
    setPendingData(formData)
    setShowConfirmDialog(true)
  }

  const handleConfirmedSubmit = async () => {
    if (!pendingData) return
    setIsLoading(true)

    try {
      const formData = new FormData()

      const projectDataBlob = new Blob([JSON.stringify(pendingData.projectData)], {
        type: "application/json",
      })
      formData.append("projectData", projectDataBlob, "projectData.json")

      pendingData.images.forEach((image) => {
        formData.append("images", image)
      })

      if (pendingData.cover) {
        formData.append("cover", pendingData.cover)
      }

      const { data } = await axios.post(`${pathUrl}/api/v1/project`, formData, {
        headers: {
          "Accept-Language": "en",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Response data:", data)

      if (!data.success) {
        throw new Error(data.message || "Failed to create project")
      }

      setShowConfirmDialog(false)
      onClose()
      toast({
        title: "Success",
        description: "Project created successfully",
      })
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add New Project</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ProjectForm onSubmit={handleSubmit} />
        </div>
      </div>

      <ConfirmDialog
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        handleConfirm={handleConfirmedSubmit}
        title="Are you sure you want to create this Project?"
        desc="Please review your project details before confirming. This action will create a new project with the provided information."
        confirmText="Yes, create project"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  )
}

