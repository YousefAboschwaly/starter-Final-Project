import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import FileUpload from "./file-upload";
import { useLocation } from "react-router-dom";

export interface IHomeDataResponse {
  success: boolean;
  status: number;
  data: IHomeData;
}

export interface IHomeData {
  colors: ColorOption[];
  productBaseUnits: ProductUnit[];
  productMaterial: ProductMaterial[];
  businessTypes: BusinessType[];
  businessTypeCategories: BusinessTypeCategory[];
  homeFurnishingRequestTypes: HomeFurnishingRequestType[];
  furnitureTypes: FurnitureType[];
  devicesAttacheds: DeviceType[];
  kitchenTypes: KitchenType[];
}

export interface ColorOption {
  id: number;
  code: string;
  name: string;
  hexColor: string;
}

export interface ProductUnit {
  id: number;
  code: string;
  name: string;
}

export interface ProductMaterial {
  id: number;
  code: string;
  name: string;
}

export interface BusinessType {
  id: number;
  code: string;
  name: string;
}

export interface BusinessTypeCategory {
  id: number;
  code: string;
  name: string;
  businessType: BusinessType;
}

export interface HomeFurnishingRequestType {
  id: number;
  code: string;
  name: string;
}

export interface FurnitureType {
  id: number;
  code: string;
  name: string;
}

export interface DeviceType {
  id: number;
  code: string;
  name: string;
}

export interface KitchenType {
  id: number;
  code: string;
  name: string;
}

interface FinishYourHomeProps {
  formType: "furnish-house";
  userToken: string | null;
  pathUrl: string;
  onStepChange: (step: number) => void;
}

interface ILocation {
  id: number;
  code?: string;
  name: string;
}
const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="text-red-500 text-sm flex items-center mt-1"
  >
    <AlertCircle className="w-4 h-4 mr-1" />
    {message}
  </motion.div>
);

const FurnishYourHome: React.FC<FinishYourHomeProps> = ({
  formType,
  pathUrl,
  userToken,
  onStepChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [HomeData, setHomeData] = useState<IHomeData | null>(null);
  const [governorates, setGovernorates] = useState<ILocation[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [phone, setPhone] = useState<string>("");
  const [selectedGovernorate, setSelectedGovernorate] = useState<number | null>(
    null
  );
  const [Selectedfurniture, setSelectedfurniture] = useState<number | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [requestTypeId, setRequestTypeId] = useState<number | null>(null);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const type = query.get("type");

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Invalid phone number")
      .required("Phone number is required"),
    governorateId: Yup.number()
      .min(1, "Governorate is required")
      .required("Governorate is required"),
    budget: Yup.number()
      .typeError("Budget must be a number")
      .positive("Budget must be positive")
      .required("Budget is required"),
    requiredDuration: Yup.number()
      .typeError("Required duration must be a number")
      .positive("Required duration must be positive")
      .required("Required duration is required"),
    furnitureTypeId: Yup.number()
      .min(1, "Furniture type is required")
      .required("Furniture type is required"),
    notes: Yup.string().optional(),
  });
  //fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IHomeDataResponse>(
        `${pathUrl}/api/v1/business-config`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
          },
        }
      );
      setHomeData(response.data.data);

      const allTypes = response.data.data.homeFurnishingRequestTypes;
      const normalizedType = type?.replace("-", "_").toUpperCase();
      const matchedType = allTypes.find((item) => item.code === normalizedType);

      console.log("Matched type:", matchedType);
      if (matchedType) {
        setRequestTypeId(matchedType.id);
      }
      console.log("Query type from URL:", type);
      console.log(
        "Available types from API:",
        allTypes.map((i) => i.code)
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({
          message:
            error.response.data.message ||
            "An error occurred during data fetching.",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //getGovernorates
  useEffect(() => {
    async function getGovernorates() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/governorates`, {
          headers: {
            "Accept-Language": "en",
          },
        });
        if (data.success) {
          setGovernorates(
            data.data.map(
              (item: { id: number; code?: string; name: string }) => ({
                id: item.id,
                code: item.code || "",
                name: item.name,
              })
            )
          );
        }
      } catch (error) {
        console.error("Error fetching governorates:", error);
        setAlert({
          message: "Failed to fetch governorates. Please try again.",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    }
    getGovernorates();
  }, [pathUrl]);

  const handleNextStep = (formik: any) => {
    const firstStepFields = [
      "phoneNumber",
      "governorateId",
      "requiredDuration",
      "furnitureTypeId",
    ];

    firstStepFields.forEach((field) => {
      formik.setFieldTouched(field, true, false);
    });

    formik.validateForm().then((errors: Record<string, string>) => {
      const hasErrors = firstStepFields.some((field) =>
        Object.keys(errors).includes(field)
      );

      if (!hasErrors) {
        setCurrentStep(2);
      }
    });
  };
  const handlePrevStep = () => {
    setCurrentStep(1);
  };
  const switchTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };
  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
  };
  // handleSubmit
  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    if (!requestTypeId) {
      setAlert({ message: "Request type not found", type: "error" });
      return;
    }

    formData.append("requestType.id", requestTypeId.toString());
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("government.id", values.governorateId.toString());
    formData.append("timeFrameDays", values.requiredDuration.toString());
    formData.append("budget", values.budget.toString());
    formData.append("furnitureType.id", values.furnitureTypeId.toString());

    if (values.notes) {
      formData.append("note", values.notes);
    }

    if (selectedFiles.length > 0) {
      formData.append("attachmentFile", selectedFiles[0]);
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await axios.post(
        `${pathUrl}/api/v1/home-furnishing-requests`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setAlert({
          message: "Furnishing submitted successfully!",
          type: "success",
        });
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({ message: "Failed to submit", type: "error" });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (error: any) {
      setAlert({ message: "Something went wrong", type: "error" });
      console.error(error);
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const Alert = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error";
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`p-4 rounded-md shadow-md ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white mb-4`}
      >
        {message}
      </motion.div>
    );
  };
  const formVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
    exit: { opacity: 0, x: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <>
      {alert && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 text-white z-50">
          <Alert message={alert.message} type={alert.type} />
        </div>
      )}
      <Formik
        initialValues={{
          phoneNumber: "",
          governorateId: 0,
          budget: "",
          requiredDuration: "",
          furnitureTypeId: 0,
          notes: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-4">
            {currentStep === 1 && (
              <>
                {/* phone number */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formik.values.phoneNumber}
                    // onChange={formik.handleChange}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setPhone(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? "border-red-500"
                        : ""
                    }
                  />
                  <AnimatePresence>
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <ErrorMessage
                          message={formik.errors.phoneNumber as string}
                        />
                      )}
                  </AnimatePresence>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  {/* Governorate */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="governorateId"> Governorate</Label>
                    <Select
                      name="governorateId"
                      onValueChange={(value) => {
                        const selectedId = Number(value);
                        formik.setFieldValue("governorateId", selectedId);
                        setSelectedGovernorate(selectedId);
                      }}
                      value={
                        formik.values.governorateId
                          ? formik.values.governorateId.toString()
                          : ""
                      }
                      onOpenChange={() =>
                        formik.setFieldTouched("governorateId", true)
                      }
                    >
                      <SelectTrigger
                        className={
                          formik.touched.governorateId &&
                          formik.errors.governorateId
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select governorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {governorates.map((gov) => (
                          <SelectItem key={gov.id} value={gov.id.toString()}>
                            {gov.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {formik.touched.governorateId &&
                        formik.errors.governorateId && (
                          <ErrorMessage message={formik.errors.governorateId} />
                        )}
                    </AnimatePresence>
                  </motion.div>
                  {/*furniture Types */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="furnitureTypeId">Furniture Types</Label>
                    <Select
                      name="furnitureTypeId"
                      onValueChange={(value) => {
                        const selectedId = Number(value);
                        formik.setFieldValue("furnitureTypeId", selectedId);
                        setSelectedfurniture(selectedId);
                      }}
                      value={
                        formik.values.furnitureTypeId
                          ? formik.values.furnitureTypeId.toString()
                          : ""
                      }
                      onOpenChange={() =>
                        formik.setFieldTouched("furnitureTypeId", true)
                      }
                    >
                      <SelectTrigger
                        className={
                          formik.touched.furnitureTypeId &&
                          formik.errors.furnitureTypeId
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select furniture Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {(HomeData?.furnitureTypes ?? []).map((furn) => (
                          <SelectItem key={furn.id} value={furn.id.toString()}>
                            {furn.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {formik.touched.furnitureTypeId &&
                        formik.errors.furnitureTypeId && (
                          <ErrorMessage
                            message={formik.errors.furnitureTypeId}
                          />
                        )}
                    </AnimatePresence>
                  </motion.div>
                  {/* Required Duration */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="requiredDuration">Required Duration</Label>
                    <Input
                      id="requiredDuration"
                      placeholder="Required Duration"
                      name="requiredDuration"
                      type="number"
                      value={formik.values.requiredDuration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formik.errors.requiredDuration &&
                        formik.touched.requiredDuration
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.errors.requiredDuration &&
                      formik.touched.requiredDuration && (
                        <ErrorMessage
                          message={formik.errors.requiredDuration}
                        />
                      )}
                  </motion.div>
                  <Button
                    type="button"
                    className="w-full h-12 text-base font-medium btn primary-grad"
                    onClick={() => handleNextStep(formik)}
                  >
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </>
            )}
            {currentStep === 2 && (
              <>
                {/* Budget */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    placeholder="Enter Budget"
                    name="budget"
                    type="number"
                    value={formik.values.budget}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.budget && formik.errors.budget
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                  />
                  {formik.touched.budget && formik.errors.budget && (
                    <ErrorMessage message={formik.errors.budget as string} />
                  )}
                </motion.div>
                {/* Notes */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Notes"
                    name="notes"
                    type="text"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>Attach Photos & Attachments</Label>
                  <FileUpload onFileChange={handleFileChange} />
                </motion.div>
                {activeTab === 1 && (
                  <motion.div
                    variants={itemVariants}
                    className="flex gap-2 pt-4"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2 h-12 text-base font-medium"
                      onClick={handlePrevStep}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-1/2 h-12 text-base font-medium btn primary-grad"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default FurnishYourHome;
