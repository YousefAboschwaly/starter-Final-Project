


// شغال تمام"ٌRequest design"
"use client";

import { useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CompactImageUpload from "../MyComponents/ImagePreviewGallery ";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const AiPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);

  const maxImages = 3;

  const validationSchema = Yup.object({
    prompt: Yup.string().required("Prompt is required"),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalUploaded = imageFiles.length + newFiles.length;

    if (totalUploaded > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const allowedFiles = newFiles.slice(0, maxImages - imageFiles.length);
    const newPreviewUrls: string[] = [];

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviewUrls.push(e.target.result as string);
          if (newPreviewUrls.length === allowedFiles.length) {
            setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
            setImageFiles((prev) => [...prev, ...allowedFiles]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const totalUploaded = imageFiles.length + newFiles.length;
    if (totalUploaded > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const allowedFiles = newFiles.slice(0, maxImages - imageFiles.length);
    const newPreviewUrls: string[] = [];

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviewUrls.push(e.target.result as string);
          if (newPreviewUrls.length === allowedFiles.length) {
            setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
            setImageFiles((prev) => [...prev, ...allowedFiles]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (values: { prompt: string }) => {
    if (imageFiles.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("image", file);
    });
    formData.append("prompt", values.prompt);

    try {
      const response = await axios.post(
        `http://51.4.114.63:8080/generate/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", 
        }
      );

      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setOutputImage(imageUrl);
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  return (
    <div>
      <Formik
        initialValues={{ prompt: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="flex flex-col w-full gap-4">
            <CompactImageUpload
              newImageFiles={imagePreviewUrls}
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              removeNewImage={removeNewImage}
            />

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <textarea
                id="prompt"
                name="prompt"
                rows={3}
                placeholder={
                  imageFiles.length > 0
                    ? "Enter your prompt..."
                    : "Please upload your image first"
                }
                value={formik.values.prompt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={imageFiles.length === 0}
                className={`w-full p-2 bg-gray-100 border rounded text-black ${
                  formik.touched.prompt && formik.errors.prompt
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <AnimatePresence>
                {formik.touched.prompt && formik.errors.prompt && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-500 text-sm"
                  >
                    {formik.errors.prompt}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn primary-grad"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="flex flex-col w-full mt-10">
  <h2 className="text-lg font-semibold mb-2 text-gray-700">
    Output Mask
  </h2>
  <div className="w-full h-full min-h-[300px] bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
    {outputImage ? (
      <img
        src={outputImage}
        alt="Output"
        className="w-full h-full object-contain rounded block"
      />
    ) : (
      <span className="text-gray-500">No output yet</span>
    )}
  </div>

  {/* Download Button */}
{outputImage && (
  <div className="mt-4 flex justify-center">
    <a
      href={outputImage}
      download="output.png"
className="flex items-center gap-2 text-gray-700  px-5 py-2 rounded-lg  hover:scale-110 transition-all duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
      </svg>
      
    </a>
    {/* <a
  href={outputImage}
  download="output.png"
  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
>
  <button className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded shadow hover:scale-105 transition-transform duration-300 font-medium">
    <Download className="w-5 h-5" />
    Download Image
  </button>
</a> */}

  </div>
)}

</div>

    </div>
  );
};

export default AiPage;





// "use client";

// import { useState, useRef } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import CompactImageUpload from "../MyComponents/ImagePreviewGallery ";
// import { Button } from "@/components/ui/button";
// import { AlertCircle, Download, Loader2 } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// const AiPage = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageFiles, setImageFiles] = useState<File[]>([]);
//   const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [outputImage, setOutputImage] = useState<string | null>(null);
//  const [alert, setAlert] = useState<{
//     message: string;
//     type: "success" | "error";
//   } | null>(null);

//   const maxImages = 3;

//   const validationSchema = Yup.object({
//     prompt: Yup.string().required("Prompt is required"),
//   });

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const newFiles = Array.from(files);
//     const totalUploaded = imageFiles.length + newFiles.length;

//     if (totalUploaded > maxImages) {
//   setAlert({
//     message: `You can only upload up to ${maxImages} images.`,
//     type: "error",
//   });

//   setTimeout(() => {
//     setAlert(null);
//   }, 3000);

//   return;
// }


//     const allowedFiles = newFiles.slice(0, maxImages - imageFiles.length);
//     const newPreviewUrls: string[] = [];

//     allowedFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           newPreviewUrls.push(e.target.result as string);
//           if (newPreviewUrls.length === allowedFiles.length) {
//             setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
//             setImageFiles((prev) => [...prev, ...allowedFiles]);
//           }
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (!files) return;

//     const newFiles = Array.from(files).filter((file) =>
//       file.type.startsWith("image/")
//     );

//     const totalUploaded = imageFiles.length + newFiles.length;
//   if (totalUploaded > maxImages) {
//   setAlert({
//     message: `You can only upload up to ${maxImages} images.`,
//     type: "error",
//   });

//   setTimeout(() => {
//     setAlert(null);
//   }, 3000);

//   return;
// }


//     const allowedFiles = newFiles.slice(0, maxImages - imageFiles.length);
//     const newPreviewUrls: string[] = [];

//     allowedFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           newPreviewUrls.push(e.target.result as string);
//           if (newPreviewUrls.length === allowedFiles.length) {
//             setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
//             setImageFiles((prev) => [...prev, ...allowedFiles]);
//           }
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeNewImage = (index: number) => {
//     setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
//     setImageFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (values: { prompt: string }) => {
//     if (imageFiles.length === 0) {
//   setAlert({
//     message: "Please upload at least one image.",
//     type: "error",
//   });

//   setTimeout(() => {
//     setAlert(null);
//   }, 3000);

//   return;
// }


//     setIsLoading(true);

//     const formData = new FormData();
//     imageFiles.forEach((file) => {
//       formData.append("image", file);
//     });
//     formData.append("prompt", values.prompt);

//     try {
//       const response = await axios.post(
//         `http://51.4.114.63:8080/generate/`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           responseType: "blob",
//         }
//       );

//       const imageBlob = response.data;
//       const imageUrl = URL.createObjectURL(imageBlob);
//       setOutputImage(imageUrl);
//     } catch (err) {
//       console.error("Submission Error:", err);
// setAlert({
//   message: "Submission failed. Please try again.",
//   type: "error",
// });

// setTimeout(() => {
//   setAlert(null);
// }, 3000);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//  const AlertComponent = ({
//     message,
//     type,
//   }: {
//     message: string;
//     type: "success" | "error";
//   }) => {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         className={`p-4 rounded-md shadow-md ${
//           type === "success" ? "bg-green-500" : "bg-red-500"
//         } text-white mb-4`}
//       >
//         {message}
//       </motion.div>
//     );
//   };
//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 },
//   };
// const ErrorMessage = ({ message }: { message: string }) => (
//   <motion.div
//     initial={{ opacity: 0, y: -10 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -10 }}
//     transition={{ duration: 0.3 }}
//     className="text-red-500 text-sm flex items-center mt-1"
//   >
//     <AlertCircle className="w-4 h-4 mr-1" />
//     {message}
//   </motion.div>
// );
//   return (
//     <>
//     {alert && (
//         <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 text-white z-50">
//           <AlertComponent message={alert.message} type={alert.type} />
//         </div>
//       )}
//     <div className="mx-10 w-full  flex flex-col lg:flex-row gap-10 px-4 py-10 min-h-screen bg-gray-100">
//       <Formik
//         initialValues={{ prompt: "" }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {(formik) => (
//           <Form className="flex flex-col w-full lg:w-1/2 gap-4">
//             <CompactImageUpload
//               newImageFiles={imagePreviewUrls}
//               fileInputRef={fileInputRef}
//               handleImageUpload={handleImageUpload}
//               handleDragOver={handleDragOver}
//               handleDrop={handleDrop}
//               removeNewImage={removeNewImage}
//             />

//             <motion.div variants={itemVariants} className="space-y-2">
//               <Label htmlFor="prompt">Prompt</Label>
//               <textarea
//                 id="prompt"
//                 name="prompt"
//                 rows={3}
//                 placeholder={
//                   imageFiles.length > 0
//                     ? "Enter your prompt..."
//                     : "Please upload your image first"
//                 }
//                 value={formik.values.prompt}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 disabled={imageFiles.length === 0}
//                 className={`w-full p-2 bg-gray-100 border rounded text-black ${
//                   formik.touched.prompt && formik.errors.prompt
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//               />
//               <AnimatePresence>
//                 {formik.touched.prompt && formik.errors.prompt && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -5 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -5 }}
//                     className="text-red-500 text-sm"
//                   >
//                     {formik.errors.prompt}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>

//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="btn primary-grad"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </Button>
//           </Form>
//         )}
//       </Formik>

//       <div className="flex flex-col w-full lg:w-1/2">
//         <h2 className="text-lg font-semibold mb-2 text-gray-700">
//           Output Mask
//         </h2>
//         <div className="w-full min-h-[500px] max-h-[060px] bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
//           {outputImage ? (
//             <img
//               src={outputImage}
//               alt="Output"
//               className="max-w-full max-h-full object-contain rounded"
//             />
//           ) : (
//             <span className="text-gray-500">No output yet</span>
//           )}
//         </div>

//         {outputImage && (
//           <div className="mt-4 flex justify-center">
//             <a
//               href={outputImage}
//               download="output.png"
//               className="flex items-center gap-2 text-gray-700 px-5 py-2 rounded-lg hover:scale-110 transition-all duration-300"
//             >
//               <Download className="h-5 w-5" />
//               Download
//             </a>
//           </div>
//         )}
//       </div>
//     </div></>
//   );
// };

// export default AiPage;

