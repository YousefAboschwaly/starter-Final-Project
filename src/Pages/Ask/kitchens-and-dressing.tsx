import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import FileUpload from "./file-upload";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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
interface KitchensAndDressingProps {
  formType: "kitchen" | "dressing";
  userToken: string | null;
  pathUrl: string;
  onStepChange: (step: number) => void;
}
interface KitchenRequestPayload {
  requestType: {
    id: number;
  };
  phoneNumber: string;
  government: {
    id: number;
  };
  timeFrameDays: number;
  budget: number;
  kitchenSize: number;
  devicesAttacheds: {
    id: number;
  }[];
  productMaterial: {
    id: number;
  }[];
  kitchenType: {
    id: number;
  };
  note?: string;
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

const KitchensAndDressing: React.FC<KitchensAndDressingProps> = ({
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
  const [KitchenData, setKitchenData] = useState<IHomeData | null>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGovernorate, setSelectedGovernorate] = useState<number | null>(
    null
  );
  const [governorates, setGovernorates] = useState<ILocation[]>([]);
  const [requestTypeId, setRequestTypeId] = useState<number | null>(null);
  const [SelectedKitchen, setSelectedkitchen] = useState<number | null>(null);
  const [Selecteddevice, setSelecteddevice] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const type = query.get("type");
  useEffect(() => {
    if (formType === "kitchen") {
      setActiveTab(1);
    } else if (formType === "dressing") {
      setActiveTab(2);
    }
  }, [formType]);

  const validationSchema = Yup.object({
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
    ...(formType === "kitchen" && {
      kitchenSize: Yup.number()
        .typeError("Kitchen size must be a number")
        .positive("Kitchen size must be positive")
        .required("Kitchen size is required"),

      kitchenTypeId: Yup.number()
        .min(1, "Kitchen type is required")
        .required("Kitchen type is required"),

      devicesAttacheds: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
          })
        )
        .min(1, "At least one device must be selected")
        .required("Devices are required"),
    }),
    productMaterial: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required(),
        })
      )
      .min(1, "At least one material must be selected")
      .required("Product material is required"),

    notes: Yup.string().optional(),
  });

  //fetchData
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
      setKitchenData(response.data.data);

      const allTypes = response.data.data.homeFurnishingRequestTypes;
      const normalizedType = (type: string | null) => {
        switch (type) {
          case "kitchen":
            return "KITCHEN";
          case "dressing":
            return "DRESSING_ROOM";
          default:
            return type?.replace("-", "_").toUpperCase() || "";
        }
      };

      const matchedType = allTypes.find(
        (item) => item.code === normalizedType(type)
      );

      console.log("Matched type:", matchedType);
      if (matchedType) {
        setRequestTypeId(matchedType.id);
      } else {
        setRequestTypeId(null);
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
  }, [type]);

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
      "kitchenSize",
      "kitchenTypeId",
      "devicesAttacheds",
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

  const firstStepFields = ["phoneNumber", "governorateId"];
  if (formType === "kitchen") {
    firstStepFields.push("kitchenSize", "kitchenTypeId", "devicesAttacheds");
  }

  const handlePrevStep = () => {
    setCurrentStep(1);
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

    if (formType === "kitchen") {
      formData.append("kitchenSize", values.kitchenSize.toString());
      formData.append("kitchenType.id", values.kitchenTypeId.toString());

      values.devicesAttacheds.forEach(
        (device: { id: number }, index: number) => {
          formData.append(
            `devicesAttacheds[${index}].id`,
            device.id.toString()
          );
        }
      );
    }

    values.productMaterial.forEach(
      (material: { id: number }, index: number) => {
        formData.append(`productMaterial[${index}].id`, material.id.toString());
      }
    );

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
            "Content-Type": "application/json",
            "Accept-Language": "en",
          },
        }
      );

      if (response.data.success) {
        setAlert({ message: "Submitted successfully!", type: "success" });
      } else {
        setAlert({ message: "Failed to submit", type: "error" });
      }
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error("Submit error:", error);
      setAlert({ message: "Something went wrong", type: "error" });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const AlertComponent = ({
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  const handleSubmitForm = (formik: any) => {
    const firstStepFields = [
      "phoneNumber",
      "governorateId",
      "kitchenSize",
      "devicesAttacheds",
      "kitchenTypeId",
    ];

    firstStepFields.forEach((field) => {
      formik.setFieldTouched(field, true, false);
    });

    formik.validateForm().then((errors: Record<string, string>) => {
      const hasErrors: boolean = firstStepFields.some((field: string) =>
        Object.keys(errors).includes(field)
      );

      if (!hasErrors) {
        formik.handleSubmit();
      }
    });
  };

  return (
    <>
      {alert && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 text-white z-50">
          <AlertComponent message={alert.message} type={alert.type} />
        </div>
      )}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate("?type=kitchen")}
          className={`w-1/2 mx-2 px-4 py-2 rounded-lg font-bold ${
            activeTab === 1 ? "border-b-2 border-[#0D132C]" : "bg-none"
          }`}
        >
          Kitchen
        </button>
        <button
          onClick={() => navigate("?type=dressing")}
          className={`w-1/2 mx-2 px-4 py-2 rounded-lg font-bold ${
            activeTab === 2 ? "border-b-2 border-[#0D132C]" : "bg-none"
          }`}
        >
          Dressing
        </button>
      </div>

      <Formik
        initialValues={{
          phoneNumber: "",
          governorateId: 0,
          budget: "",
          requiredDuration: "",
          kitchenSize: "",
          kitchenTypeId: 0,
          devicesAttacheds: [],
          productMaterial: [],
          notes: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-4">
            {currentStep === 1 && (
              <>
                {/* phoneNumber */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
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
                {/* governorate */}
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
                {/*kitchen Types */}
                {formType === "kitchen" && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="kitchenTypeId">Kitchen Types</Label>
                    <Select
                      name="kitchenTypeId"
                      onValueChange={(value) => {
                        const selectedId = Number(value);
                        formik.setFieldValue("kitchenTypeId", selectedId);
                        setSelectedkitchen(selectedId);
                      }}
                      value={
                        formik.values.kitchenTypeId
                          ? formik.values.kitchenTypeId.toString()
                          : ""
                      }
                      onOpenChange={() =>
                        formik.setFieldTouched("kitchenTypeId", true)
                      }
                    >
                      <SelectTrigger
                        className={
                          formik.touched.kitchenTypeId &&
                          formik.errors.kitchenTypeId
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select kitchen Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {(KitchenData?.kitchenTypes ?? []).map((kit) => (
                          <SelectItem key={kit.id} value={kit.id.toString()}>
                            {kit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {formik.touched.kitchenTypeId &&
                        formik.errors.kitchenTypeId && (
                          <ErrorMessage message={formik.errors.kitchenTypeId} />
                        )}
                    </AnimatePresence>
                  </motion.div>
                )}
                {/*Device attaches */}
                {formType === "kitchen" &&
                  (KitchenData?.devicesAttacheds?.length ?? 0) > 0 && (
                    <div className="grid gap-2">
                      <Label htmlFor="devicesAttacheds">Devices Attached</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {KitchenData?.devicesAttacheds.map((device) => (
                          <Card
                            key={device.id}
                            className="p-2 flex justify-between items-center"
                          >
                            <label
                              htmlFor={`device-${device.id}`}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                id={`device-${device.id}`}
                                checked={formik.values.devicesAttacheds.some(
                                  (d: { id: number }) => d.id === device.id
                                )}
                                onChange={(e) => {
                                  const updatedDevices = e.target.checked
                                    ? [
                                        ...formik.values.devicesAttacheds,
                                        { id: device.id },
                                      ]
                                    : formik.values.devicesAttacheds.filter(
                                        (d: { id: number }) =>
                                          d.id !== device.id
                                      );
                                  formik.setFieldValue(
                                    "devicesAttacheds",
                                    updatedDevices
                                  );
                                }}
                                className="mr-2"
                              />
                              {device.name}
                            </label>
                          </Card>
                        ))}
                      </div>
                      {formik.touched.devicesAttacheds &&
                        formik.errors.devicesAttacheds && (
                          <p className="text-red-500 text-sm">
                            {typeof formik.errors.devicesAttacheds === "string"
                              ? formik.errors.devicesAttacheds
                              : "At least one device is required"}
                          </p>
                        )}
                    </div>
                  )}

                {/* Kitchen Size */}
                {formType === "kitchen" && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="kitchenSize">Kitchen Size</Label>
                    <Input
                      id="kitchenSize"
                      placeholder="Enter kitchen size"
                      name="kitchenSize"
                      type="number"
                      value={formik.values.kitchenSize}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.kitchenSize && formik.errors.kitchenSize
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    />
                    {formik.touched.kitchenSize &&
                      formik.errors.kitchenSize && (
                        <ErrorMessage
                          message={formik.errors.kitchenSize as string}
                        />
                      )}
                  </motion.div>
                )}
                <Button
                  type="button"
                  className="w-full h-12 text-base font-medium btn primary-grad"
                  onClick={() => handleNextStep(formik)}
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Product material */}
                {(KitchenData?.productMaterial?.length ?? 0) > 0 && (
                  <div className="grid gap-2">
                    <Label htmlFor="productMaterial">Product Material</Label>

                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-scroll scrollbar-hide pr-1">
                      {KitchenData?.productMaterial.map((device) => (
                        <Card
                          key={device.id}
                          className="p-2 flex justify-between items-center"
                        >
                          <label
                            htmlFor={`device-${device.id}`}
                            className="flex items-center"
                          >
                            <input
                              type="checkbox"
                              id={`device-${device.id}`}
                              checked={formik.values.productMaterial.some(
                                (d: { id: number }) => d.id === device.id
                              )}
                              onChange={(e) => {
                                const updatedDevices = e.target.checked
                                  ? [
                                      ...formik.values.productMaterial,
                                      { id: device.id },
                                    ]
                                  : formik.values.productMaterial.filter(
                                      (d: { id: number }) => d.id !== device.id
                                    );
                                formik.setFieldValue(
                                  "productMaterial",
                                  updatedDevices
                                );
                              }}
                              className="mr-2"
                            />
                            {device.name}
                          </label>
                        </Card>
                      ))}
                    </div>

                    {formik.touched.productMaterial &&
                      formik.errors.productMaterial && (
                        <p className="text-red-500 text-sm">
                          {typeof formik.errors.productMaterial === "string"
                            ? formik.errors.productMaterial
                            : "At least one product is required"}
                        </p>
                      )}
                  </div>
                )}

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
                      <ErrorMessage message={formik.errors.requiredDuration} />
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

                <motion.div variants={itemVariants} className="flex gap-2 pt-4">
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
              </>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default KitchensAndDressing;
