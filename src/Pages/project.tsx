import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import { UserContext } from "@/Contexts/UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { IFormData, IProjectData } from "@/interfaces";
import ProjectCard from "@/MyComponents/Project-Card.tsx";

export default function Project() {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { userToken, pathUrl } = userContext;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function getProjectById() {
    return axios.get(`${pathUrl}/api/v1/project/${projectId}`, {
      headers: {
        "Accept-Language": "en",
        Authorization: `Bearer ${userToken}`,
      },
    });
  }

  const { data: project, isLoading: projectLoading } = useQuery<
    { data: { data: IProjectData } },
    Error,
    IProjectData
  >({
    queryKey: ["project", projectId],
    queryFn: getProjectById,
    select: (data) => data.data.data,
  });

  const handleEdit = async (formData: IFormData) => {
    try {
      setIsLoading(true);
      const apiFormData = new FormData();

      const projectDataBlob = new Blob(
        [
          JSON.stringify({
            ...formData.projectData,
            id: Number(projectId),
          }),
        ],
        {
          type: "application/json",
        }
      );
      apiFormData.append("projectData", projectDataBlob, "projectData.json");

      // Add cover image first if it exists
      if (formData.cover) {
        apiFormData.append("images", formData.cover);
      }

      // Then add the rest of the images
      formData.images.forEach((image) => {
        apiFormData.append("images", image);
      });

      console.log("apiFormData", apiFormData);
      const { data } = await axios.put(
        `${pathUrl}/api/v1/project`,
        apiFormData,
        {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("data", data);
      if (data.success) {
        await queryClient.invalidateQueries(["project", projectId]);

        toast.success("🎉 Project updated successfully!", {
          duration: 2000,
          position: "top-center",
        });

        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
      } else {
        throw new Error(data.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("❌ Failed to update project", {
        duration: 2000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(
        `${pathUrl}/api/v1/project/${projectId}`,
        {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("🗑️ Project deleted successfully!", {
          duration: 2000,
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("⚠️ Failed to delete project", {
        duration: 2000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (projectLoading) {
    return;
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50">
        <ProjectCard
          project={project!}
          pathUrl={pathUrl}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isSuccess={isSuccess}
        />
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            minWidth: "300px",
            padding: "20px 24px",
            fontSize: "16px",
            fontWeight: "500",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
          // success: {
          //   style: {
          //     background: "#16a339",
          //     color: "#fff",
          //   }
          // },
          error: {
            style: {
              background: "#dc2626",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#dc2626",
            },
          },
        }}
      />
    </>
  );
}
