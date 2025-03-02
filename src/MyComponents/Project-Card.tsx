import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar,
  PenTool as Tool,
  Pencil,
  Trash2,
  ChevronRight,
  X,
} from "lucide-react";
import { IProjectData } from "@/interfaces";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IFormData } from "@/interfaces";
import ProjectForm from "./project-form";
import { toast } from "react-hot-toast";

interface IProps {
  project: IProjectData;
  pathUrl: string;
  handleEdit: (data: IFormData) => void;
  handleDelete: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isSuccess: boolean;
}
export default function ProjectCard({
  project,
  pathUrl,
  handleEdit,
  handleDelete,
  isLoading,
  setIsLoading,
  isSuccess,
}: IProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleModalClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the image
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = async (data: IFormData) => {
    try {
      await handleEdit(data);
      // Only set isEditing to false after successful edit
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit project:", error);
      toast.error("Failed to edit project");
    }
  };

  if (isEditing) {
    const defaultValues = {
      projectData: {
        name: project.name,
        description: project.description,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        tools: project.tools,
      },
      images: [], // This will be populated through existingImages prop
    };

    if (isSuccess) {
      setIsEditing(false);
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50 flex items-center justify-center p-6">
        <div className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden max-w-6xl w-full border border-white/30 p-10">
          <Button
            onClick={() => setIsEditing(false)}
            className="absolute top-4 right-4"
            variant="ghost"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
          <ProjectForm
            onSubmit={handleFormSubmit}
            defaultValues={{
              projectData: {
                ...defaultValues.projectData,
                startDate: project.startDate,
                endDate: project.endDate
              },
              images: defaultValues.images
            }}
            isEditing={true}
            existingImages={project.images}
            pathUrl={pathUrl}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden max-w-6xl w-full border border-white/30"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-rose-200/20 to-amber-200/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 p-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-sky-600 bg-clip-text text-transparent mb-4">
              {project?.name}
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              {project?.description}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="relative h-[600px] rounded-3xl overflow-hidden group">
                <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={`${pathUrl}/api/v1/file/download?fileName=${project?.images[0].path}`}
                  alt="Main project image"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  initial={false}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                >
                  <div className="flex md:flex-nowrap flex-wrap gap-4">
                    {project?.images.map((image, index) => (
                      <motion.div
                        key={image.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(index)}
                        className="relative md:w-24 md:h-24 w-[5.5rem] h-[5.5rem] rounded-xl overflow-hidden cursor-pointer ring-2 ring-white/30 hover:ring-white transition-all duration-300"
                      >
                        <img
                          src={`${pathUrl}/api/v1/file/download?fileName=${image.path}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col justify-center space-y-8"
            >
              {/* Info Cards */}
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group bg-white/80 p-5 rounded-2xl shadow-lg border border-white/50 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="bg-blue-100 p-3 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors"
                    >
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">
                        Timeline
                      </h3>
                      <p className="text-gray-700">
                        {project?.startDate
                          ? format(new Date(project.startDate), "MMM dd, yyyy")
                          : ""}{" "}
                        -
                        {project?.endDate
                          ? format(new Date(project.endDate), "MMM dd, yyyy")
                          : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group bg-white/80 p-5 rounded-2xl shadow-lg border border-white/50 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="bg-purple-100 p-3 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors"
                    >
                      <Tool className="w-6 h-6 text-purple-600" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">
                        Tools Used
                      </h3>
                      <p className="text-gray-700">{project?.tools}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditClick}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 p-px"
                >
                  <div className="relative flex items-center justify-center bg-white py-4 px-8 rounded-2xl transition-colors group-hover:bg-transparent">
                    <span className="relative flex items-center text-blue-600 font-semibold group-hover:text-white transition-colors">
                      <Pencil className="w-5 h-5 mr-3" />
                      Edit Project
                      <motion.div
                        className="ml-3"
                        initial={false}
                        animate={{ x: 0 }}
                        whileHover={{ x: 4 }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="w-full group relative overflow-hidden rounded-2xl border-2 border-rose-500 p-px"
                >
                  <div className="relative flex items-center justify-center py-4 px-8 rounded-2xl transition-colors group-hover:bg-rose-50">
                    <span className="relative flex items-center text-rose-500 font-semibold">
                      <Trash2 className="w-5 h-5 mr-3" />
                      Delete Project
                    </span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClick}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white"
            >
              <X className="w-8 h-8" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full rounded-3xl overflow-hidden"
            >
              <img
                src={`${pathUrl}/api/v1/file/download?fileName=${project?.images[selectedImage].path}`}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
