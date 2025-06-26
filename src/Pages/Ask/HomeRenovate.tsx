import { Formik, Form, FormikHelpers, FormikContextType } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FixedPackageSlider from "./FixedPackageData";
import { useNavigate } from "react-router-dom";

interface HomeRenovateProps {
  userToken: string | null;
  pathUrl: string;
  onStepChange: (step: number) => void;
}

interface IHomeData {
  data: {
    unitTypes: UnitType[];
    unitStatuses: UnitStatus[];
    unitWorkTypes: UnitWorkType[];
    workSkills: WorkSkill[];
    governorates: Governorate[];
  };
}

interface UnitType {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface UnitStatus {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface UnitWorkType {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface WorkSkill {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  nameEn: string;
}

interface Governorate {
  id: number;
  code: string;
  name: string;
}

interface ILocation {
  id: number;
  code?: string;
  name: string;
}

interface ClientData {
  id: number;
  name: string;
  nameAr: string;
  nameEn: string;
  price: number;
  details: string;
  detailsAr: string;
  detailsEn: string;
}

interface IFixedPackage {
  data: ClientData[];
}

interface FormValues {
  phoneNumber: string;
  unitTypeId: number;
  isInsideCompound: boolean | "";
  unitStatusesId: number;
  unitWorkTypesId: number;
  workSkillsId: number;
  governorateId: number;
  cityId: number;
  unitArea: string;
  budget: string;
  region: string;
  numberOfRooms: string;
  numberOfBathrooms: string;
  requiredDuration: string;
  notes: string;
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

const HomeRenovate: React.FC<HomeRenovateProps> = ({
  pathUrl,
  userToken,
  onStepChange,
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [homeData, setHomeData] = useState<IHomeData | null>(null);
  const [packageData, setPackageData] = useState<IFixedPackage | null>(null);
  const [governorates, setGovernorates] = useState<ILocation[]>([]);
  const [cities, setCities] = useState<ILocation[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedGovernorate, setSelectedGovernorate] = useState<number | null>(
    null
  );
  const [phone, setPhone] = useState<string>("");
  const [unitTypeId, setUnitTypeId] = useState<number | string>("");
  const [InsideCompound, setInsideCompound] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Invalid phone number")
      .required("Phone number is required"),
    unitTypeId: Yup.number()
      .min(1, "Unit type is required")
      .required("Unit type is required"),
    isInsideCompound: Yup.boolean().required(
      "Please select if inside compound"
    ),
    unitStatusesId: Yup.number()
      .min(1, "Unit Status is required")
      .required("Unit Status is required"),
    unitWorkTypesId: Yup.number()
      .min(1, "Unit Work is required")
      .required("Unit Work is required"),
    workSkillsId: Yup.number()
      .min(1, "Work Skills is required")
      .required("Work Skills is required"),
    governorateId: Yup.number()
      .min(1, "Governorate is required")
      .required("Governorate is required"),
    cityId: Yup.number()
      .min(1, "City is required")
      .required("City is required"),
    budget: Yup.number()
      .typeError("Budget must be a number")
      .positive("Budget must be positive")
      .required("Budget is required"),
    unitArea: Yup.number()
      .typeError("Unit area must be a number")
      .positive("Unit area must be positive")
      .required("Unit area is required"),
    region: Yup.number()
      .typeError("Region must be a number")
      .positive("Region must be positive")
      .required("Region is required"),
    numberOfRooms: Yup.number()
      .typeError("Number of rooms must be a number")
      .positive("Number of rooms must be positive")
      .required("Number of rooms is required"),
    numberOfBathrooms: Yup.number()
      .typeError("Number of bathrooms must be a number")
      .positive("Number of bathrooms must be positive")
      .required("Number of bathrooms is required"),
    requiredDuration: Yup.number()
      .typeError("Required duration must be a number")
      .positive("Required duration must be positive")
      .required("Required duration is required"),
    notes: Yup.string().optional(),
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IHomeData>(
        `${pathUrl}/api/v1/home-renovate/lkps`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
          },
        }
      );
      console.log(response)
      setHomeData(response.data);
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
  }, [pathUrl, userToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  useEffect(() => {
    async function getCities(governorateId: number) {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/cities/governorate/${governorateId}`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setCities(
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
        console.error("Error fetching cities:", error);
        setAlert({
          message: "Failed to fetch cities. Please try again.",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    }

    if (selectedGovernorate) {
      getCities(selectedGovernorate);
    } else {
      setCities([]);
    }
  }, [selectedGovernorate, pathUrl]);

  const GetFixedPackage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<IFixedPackage>(
        `${pathUrl}/api/v1/custom-package`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
          },
        }
      );
      setPackageData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({
          message:
            error.response.data.message ||
            "An error occurred during Get FixedPackageData",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathUrl, userToken]);

  useEffect(() => {
    GetFixedPackage();
  }, [GetFixedPackage]);

  const handleNextStep = (formik: FormikContextType<FormValues>) => {
    const firstStepFields = ["phoneNumber", "unitTypeId", "isInsideCompound"];

    firstStepFields.forEach((field) => {
      formik.setFieldTouched(field, true, false);
    });

    formik.validateForm().then((errors) => {
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

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    setIsLoading(true);
    try {
      let payload;

      if (activeTab === 1) {
        payload = {
          phoneNumber: values.phoneNumber,
          isInsideCompound: values.isInsideCompound,
          unitType: { id: values.unitTypeId },
          unitStatuses: { id: values.unitStatusesId },
          unitWorkTypes: { id: values.unitWorkTypesId },
          workSkills: { id: values.workSkillsId },
          city: { id: values.cityId },
          governorate: { id: values.governorateId },
          unitArea: Number(values.unitArea),
          budget: Number(values.budget),
          region: values.region,
          numberOfRooms: Number(values.numberOfRooms),
          numberOfBathrooms: Number(values.numberOfBathrooms),
          requiredDuration: Number(values.requiredDuration),
          notes: values.notes,
        };
      }

      let endpoint;
      if (activeTab === 1) {
        endpoint = `${pathUrl}/api/v1/home-renovate`;
      }

      if (!endpoint) {
        throw new Error("Endpoint is undefined");
      }
      
      const { data } = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
      });

      if (data.success) {
        setAlert({ message: "Package submitted successfully!", type: "success" });
        setTimeout(() => {
          setAlert(null);
          navigate('/')
        }, 3000);
        resetForm();
      } else {
        setAlert({
          message: data.message || "Submission failed",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({
          message:
            error.response.data.message ||
            "An error occurred during submission.",
          type: "error",
        });
      } else {
        setAlert({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
      setTimeout(() => {
        setAlert(null);
        navigate('/')
      }, 3000);
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
          unitTypeId: 0,
          isInsideCompound: "",
          unitStatusesId: 0,
          unitWorkTypesId: 0,
          workSkillsId: 0,
          governorateId: 0,
          cityId: 0,
          unitArea: "",
          budget: "",
          region: "",
          numberOfRooms: "",
          numberOfBathrooms: "",
          requiredDuration: "",
          notes: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-4">
            {currentStep === 1 && (
              <>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formik.values.phoneNumber}
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
                  <Label htmlFor="unitTypeId">Unit Type</Label>
                  <Select
                    name="unitTypeId"
                    onValueChange={(value) => {
                      setUnitTypeId(value);
                      formik.setFieldValue("unitTypeId", Number(value));
                    }}
                    value={
                      formik.values.unitTypeId
                        ? formik.values.unitTypeId.toString()
                        : ""
                    }
                    onOpenChange={() =>
                      formik.setFieldTouched("unitTypeId", true)
                    }
                  >
                    <SelectTrigger
                      className={
                        formik.touched.unitTypeId && formik.errors.unitTypeId
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      {homeData?.data.unitTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {formik.touched.unitTypeId && formik.errors.unitTypeId && (
                      <ErrorMessage
                        message={formik.errors.unitTypeId as string}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="isInsideCompound">Is Inside Compound</Label>
                  <Select
                    name="isInsideCompound"
                    onValueChange={(value) => {
                      setInsideCompound(value);
                      formik.setFieldValue(
                        "isInsideCompound",
                        value === "true"
                      );
                    }}
                    value={
                      formik.values.isInsideCompound !== undefined
                        ? formik.values.isInsideCompound.toString()
                        : ""
                    }
                    onOpenChange={() =>
                      formik.setFieldTouched("isInsideCompound", true)
                    }
                  >
                    <SelectTrigger
                      className={
                        formik.touched.isInsideCompound &&
                        formik.errors.isInsideCompound
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select inside compound status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {formik.touched.isInsideCompound &&
                      formik.errors.isInsideCompound && (
                        <ErrorMessage
                          message={formik.errors.isInsideCompound as string}
                        />
                      )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
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
                {/* Tabs */}
                <div className="flex justify-between mb-4 mx-5">
                  <button
                    onClick={() => switchTab(1)}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      activeTab === 1
                        ? "border-b-2 border-[#0D132C]"
                        : "bg-none"
                    }  transition-all duration-200`}
                  >
                    Split Your Package
                  </button>
                  <button
                    onClick={() => switchTab(2)}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      activeTab === 2
                        ? "border-b-2 border-[#0D132C]"
                        : "bg-none"
                    }  transition-all duration-200`}
                  >
                    Fixed Package
                  </button>
                </div>

                {/* Content of first tab */}
                {activeTab === 1 && (
                  <div>
                    {/* unitStatuses */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="unitStatusesId">Unit Status</Label>
                      <Select
                        name="unitStatusesId"
                        onValueChange={(value) =>
                          formik.setFieldValue("unitStatusesId", Number(value))
                        }
                        value={
                          formik.values.unitStatusesId
                            ? formik.values.unitStatusesId.toString()
                            : ""
                        }
                        onOpenChange={() =>
                          formik.setFieldTouched("unitStatusesId", true)
                        }
                      >
                        <SelectTrigger
                          className={
                            formik.touched.unitStatusesId &&
                            formik.errors.unitStatusesId
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select unit status" />
                        </SelectTrigger>
                        <SelectContent>
                          {homeData?.data.unitStatuses?.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={status.id.toString()}
                            >
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {formik.touched.unitStatusesId &&
                          formik.errors.unitStatusesId && (
                            <ErrorMessage
                              message={formik.errors.unitStatusesId as string}
                            />
                          )}
                      </AnimatePresence>
                    </motion.div>

                    {/* unitWorkTypes */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="unitWorkTypesId"> Unit Work Type</Label>
                      <Select
                        name="unitWorkTypesId"
                        onValueChange={(value) =>
                          formik.setFieldValue("unitWorkTypesId", Number(value))
                        }
                        value={
                          formik.values.unitWorkTypesId
                            ? formik.values.unitWorkTypesId.toString()
                            : ""
                        }
                        onOpenChange={() =>
                          formik.setFieldTouched("unitWorkTypesId", true)
                        }
                      >
                        <SelectTrigger
                          className={
                            formik.touched.unitWorkTypesId &&
                            formik.errors.unitWorkTypesId
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select unit work type" />
                        </SelectTrigger>
                        <SelectContent>
                          {homeData?.data.unitWorkTypes?.map((workType) => (
                            <SelectItem
                              key={workType.id}
                              value={workType.id.toString()}
                            >
                              {workType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {formik.touched.unitWorkTypesId &&
                          formik.errors.unitWorkTypesId && (
                            <ErrorMessage
                              message={formik.errors.unitWorkTypesId as string}
                            />
                          )}
                      </AnimatePresence>
                    </motion.div>
                    {/* workSkills */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="workSkillsId">Work Skill</Label>
                      <Select
                        name="workSkillsId"
                        onValueChange={(value) =>
                          formik.setFieldValue("workSkillsId", Number(value))
                        }
                        value={
                          formik.values.workSkillsId
                            ? formik.values.workSkillsId.toString()
                            : ""
                        }
                        onOpenChange={() =>
                          formik.setFieldTouched("workSkillsId", true)
                        }
                      >
                        <SelectTrigger
                          className={
                            formik.touched.workSkillsId &&
                            formik.errors.workSkillsId
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select work skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {homeData?.data.workSkills?.map((skill) => (
                            <SelectItem
                              key={skill.id}
                              value={skill.id.toString()}
                            >
                              {skill.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {formik.touched.workSkillsId &&
                          formik.errors.workSkillsId && (
                            <ErrorMessage
                              message={formik.errors.workSkillsId as string}
                            />
                          )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Governorate */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="governorateId"> Governorate</Label>
                      <Select
                        name="governorateId"
                        onValueChange={(value) => {
                          const selectedId = Number(value);
                          formik.setFieldValue("governorateId", selectedId);
                          setSelectedGovernorate(selectedId);
                          formik.setFieldValue("cityId", cities[0]?.id || 0); // Set default city
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
                            <ErrorMessage
                              message={formik.errors.governorateId as string}
                            />
                          )}
                      </AnimatePresence>
                    </motion.div>

                    {/* City */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="cityId"> City</Label>
                      <Select
                        name="cityId"
                        onValueChange={(value) =>
                          formik.setFieldValue("cityId", Number(value))
                        }
                        value={
                          formik.values.cityId
                            ? formik.values.cityId.toString()
                            : ""
                        }
                        onOpenChange={() =>
                          formik.setFieldTouched("cityId", true)
                        }
                        disabled={!selectedGovernorate || cities.length === 0}
                      >
                        <SelectTrigger
                          className={
                            formik.touched.cityId && formik.errors.cityId
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={city.id.toString()}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {formik.touched.cityId && formik.errors.cityId && (
                          <ErrorMessage message={formik.errors.cityId as string} />
                        )}
                      </AnimatePresence>
                    </motion.div>
                    {/* Unit Area */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="unitArea">Unit Area</Label>
                      <Input
                        id="unitArea"
                        placeholder="Enter Unit Area"
                        name="unitArea"
                        type="number"
                        value={formik.values.unitArea}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.unitArea && formik.errors.unitArea
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                      />
                      {formik.touched.unitArea && formik.errors.unitArea && (
                        <ErrorMessage
                          message={formik.errors.unitArea as string}
                        />
                      )}
                    </motion.div>
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
                        <ErrorMessage
                          message={formik.errors.budget as string}
                        />
                      )}
                    </motion.div>
                    {/* Region */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        placeholder="Enter region"
                        name="region"
                        type="number"
                        value={formik.values.region}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formik.touched.region && formik.errors.region
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formik.touched.region && formik.errors.region && (
                        <ErrorMessage
                          message={formik.errors.region as string}
                        />
                      )}
                    </motion.div>

                    {/* Number of Rooms */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="numberOfRooms">Number of Rooms</Label>
                      <Input
                        id="numberOfRooms"
                        placeholder="Number of Rooms"
                        name="numberOfRooms"
                        type="number"
                        value={formik.values.numberOfRooms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formik.errors.numberOfRooms &&
                          formik.touched.numberOfRooms
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formik.errors.numberOfRooms &&
                        formik.touched.numberOfRooms && (
                          <ErrorMessage message={formik.errors.numberOfRooms as string} />
                        )}
                    </motion.div>

                    {/* Number of Bathrooms */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="numberOfBathrooms">
                        Number of Bathrooms
                      </Label>
                      <Input
                        id="numberOfBathrooms"
                        placeholder="Number of Bathrooms"
                        name="numberOfBathrooms"
                        type="number"
                        value={formik.values.numberOfBathrooms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formik.errors.numberOfBathrooms &&
                          formik.touched.numberOfBathrooms
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formik.errors.numberOfBathrooms &&
                        formik.touched.numberOfBathrooms && (
                          <ErrorMessage
                            message={formik.errors.numberOfBathrooms as string}
                          />
                        )}
                    </motion.div>
                    {/* Required Duration */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="requiredDuration">
                        Required Duration
                      </Label>
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
                            message={formik.errors.requiredDuration as string}
                          />
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
                  </div>
                )}
                {/* Content of second tab */}
                {activeTab === 2 && (
                  <div>
                    <FixedPackageSlider
                      data={packageData?.data || []}
                      phone={phone}
                      InsideCompound={InsideCompound}
                      unitTypeId={unitTypeId}
                    />
                  </div>
                )}

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

export default HomeRenovate;