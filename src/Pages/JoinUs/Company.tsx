"use client";

import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type FormikErrors, type FormikTouched, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  RegisterForm,
  type ISignUpForm,
} from "../../MyComponents/RegisterForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { UserContext } from "@/Contexts/UserContext";

// Interface definitions
interface ITechnicalWorkerForm {
  technicalWorker: {
    type: {
      id: number;
    };
    yearsOfExperience: string;
    workerServs: Array<{ id: number }>;
  };
}

interface ITechnicalWorkerType {
  id: number;
  code: string;
  name: string;
}

interface ITechnicalWorkerService {
  id: number;
  name: string;
}

interface IBusinessFormValues {
  tradName: string;
  bioAr: string;
  bioEn: string;
  businessTypes: Array<{ id: number }>;
  [key: string]: string | Array<{ id: number }> | undefined;
}

interface IStoreForm {
  store: {
    tradName: string;
    bioAr: string;
    bioEn: string;
    businessTypes: Array<{ id: number }>;
  };
}

interface IExhibitionForm {
  exhibition: {
    tradName: string;
    bioAr: string;
    bioEn: string;
    businessTypes: Array<{ id: number }>;
  };
}

interface IUserTypes {
  id: number;
  code: string;
  name: string;
}

interface ILocation {
  id: number;
  code: string;
  name: string;
}

interface IEngineerForm {
  engineer: {
    type: {
      id: number;
    };
    yearsOfExperience: string;
    engineerServ: Array<{ id: number }>;
  };
}

interface IDataToSend {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: { id: number; code: string };
  phone?: string;
  rePassword?: string;
  governorate?: { id: number };
  city?: { id: number };
  engineer?: {
    type: { id: number };
    yearsOfExperience: number;
    engineerServ: Array<{ id: number }>;
  };
  technicalWorker?: {
    type: { id: number };
    yearsOfExperience: number;
    workerServs: Array<{ id: number }>;
  };
  business?: {
    userType: { id: number };
    tradName: string;
    bioAr: string;
    bioEn: string;
    businessTypes: Array<{ id: number }>;
  };
}

type FormValues = IEngineerForm &
  ITechnicalWorkerForm & { store: IBusinessFormValues } & {
    exhibition: IBusinessFormValues;
  };

interface IGovernorate {
  id: number;
  code?: string;
  name: string;
}

interface ICity {
  id: number;
  code?: string;
  name: string;
}

interface NestedObject {
  [key: string]:
    | string
    | number
    | boolean
    | NestedObject
    | Array<NestedObject | string | number | boolean | null>
    | null
    | undefined;
}

// Background slider component
const BackgroundSlider = () => {
  const images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=60",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Business image ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 backdrop-blur-sm" />
    </div>
  );
};

// Company animation component
const CompanyAnimation = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <BackgroundSlider />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <Briefcase className="w-16 h-16 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Platform</h2>
          <p className="text-xl">
            Register your company and start growing your business today
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Alert component with auto-hide functionality
const Alert = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

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

// Validation schemas
const engineerValidationSchema = Yup.object().shape({
  engineer: Yup.object().shape({
    type: Yup.object().shape({
      id: Yup.number().min(1, "Engineer type is required"),
    }),
    yearsOfExperience: Yup.string()
      .required("Years of experience is required")
      .test(
        "is-number",
        "Must be a valid number",
        (value) => !isNaN(Number(value))
      ),
    engineerServ: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required(),
        })
      )
      .min(1, "At least one engineer service is required"),
  }),
});

const technicalWorkerValidationSchema = Yup.object().shape({
  technicalWorker: Yup.object().shape({
    type: Yup.object().shape({
      id: Yup.number().min(1, "Technical worker type is required"),
    }),
    yearsOfExperience: Yup.string()
      .required("Years of experience is required")
      .test(
        "is-number",
        "Must be a valid number",
        (value) => !isNaN(Number(value))
      ),
    workerServs: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required(),
        })
      )
      .min(1, "At least one technical worker service is required"),
  }),
});

const storeValidationSchema = Yup.object().shape({
  store: Yup.object().shape({
    tradName: Yup.string().required("Trade name is required"),
    bioAr: Yup.string().required("Arabic bio is required"),
    bioEn: Yup.string().required("English bio is required"),
    businessTypes: Yup.array().min(1, "At least one business type is required"),
  }),
});

const exhibitionValidationSchema = Yup.object().shape({
  exhibition: Yup.object().shape({
    tradName: Yup.string().required("Trade name is required"),
    bioAr: Yup.string().required("Arabic bio is required"),
    bioEn: Yup.string().required("English bio is required"),
    businessTypes: Yup.array().min(1, "At least one business type is required"),
  }),
});

// Main Company component
export default function Company() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { userType: userTypeParam } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<{ id: number; code: string }>({
    id: 0,
    code: "",
  });
  const [formData, setFormData] = useState<
    ISignUpForm &
      IEngineerForm &
      ITechnicalWorkerForm &
      IStoreForm &
      IExhibitionForm
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
    userType: { id: 0, code: "" },
    engineer: {
      type: { id: 0 },
      yearsOfExperience: "",
      engineerServ: [],
    },
    technicalWorker: {
      type: { id: 0 },
      yearsOfExperience: "",
      workerServs: [],
    },
    store: {
      tradName: "",
      bioAr: "",
      bioEn: "",
      businessTypes: [],
    },
    exhibition: {
      tradName: "",
      bioAr: "",
      bioEn: "",
      businessTypes: [],
    },
  });
  const [userTypes, setUserTypes] = useState<IUserTypes[]>([]);
  const [engineerTypes, setEngineerTypes] = useState<ILocation[]>([]);
  const [engineerServices, setEngineerServices] = useState<ILocation[]>([]);
  const [technicalWorkerTypes, setTechnicalWorkerTypes] = useState<
    ITechnicalWorkerType[]
  >([]);
  const [technicalWorkerServices, setTechnicalWorkerServices] = useState<
    ITechnicalWorkerService[]
  >([]);
  const [businessTypes, setBusinessTypes] = useState<ILocation[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [governorates, setGovernorates] = useState<IGovernorate[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<number | null>(
    null
  );

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { pathUrl } = userContext;

  // Get validation schema based on user type
  const getValidationSchema = () => {
    switch (userType.code) {
      case "ENGINEER":
        return engineerValidationSchema;
      case "TECHNICAL_WORKER":
        return technicalWorkerValidationSchema;
      case "STORE":
        return storeValidationSchema;
      case "EXHIBITION":
        return exhibitionValidationSchema;
      default:
        return Yup.object();
    }
  };

  // Initialize Formik
  const formik = useFormik<FormValues>({
    initialValues: {
      engineer: {
        type: { id: 0 },
        yearsOfExperience: "",
        engineerServ: [],
      },
      technicalWorker: {
        type: { id: 0 },
        yearsOfExperience: "",
        workerServs: [],
      },
      store: {
        tradName: "",
        bioAr: "",
        bioEn: "",
        businessTypes: [],
      },
      exhibition: {
        tradName: "",
        bioAr: "",
        bioEn: "",
        businessTypes: [],
      },
    },
    validationSchema: getValidationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: (values) => {
      handleSignUp(values);
    },
  });

  // Update validation schema when user type changes
  useEffect(() => {
    // We need to recreate the formik instance with the new validation schema
    // This is handled by providing the validationSchema in the useFormik call
    // The formik instance will update when userType changes because getValidationSchema() depends on userType
  }, []); // Only depend on userType

  // Fetch user types
  useEffect(() => {
    async function getUserTypes() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/user-types`, {
          headers: { "Accept-Language": "en" },
        });
        setUserTypes(data.data);
      } catch (error) {
        console.error("Error fetching User Types:", error);
        setAlert({
          message: "Failed to fetch user types. Please try again.",
          type: "error",
        });
      }
    }
    getUserTypes();
  }, [pathUrl]);

  // Set user type from URL parameter
  useEffect(() => {
    if (userTypes.length > 0 && userTypeParam) {
      const matchedUserType = userTypes.find(
        (type) => type.name.toLowerCase() === userTypeParam.toLowerCase()
      );
      if (matchedUserType) {
        setUserType({ id: matchedUserType.id, code: matchedUserType.code });
        setFormData((prevData) => ({
          ...prevData,
          userType: { id: matchedUserType.id, code: matchedUserType.code },
        }));
      }
    }
  }, [userTypes, userTypeParam]);

  // Fetch engineer types
  useEffect(() => {
    async function getEngineerTypes() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/engineer-types`, {
          headers: {
            "Accept-Language": "en",
          },
        });
        if (data.success) {
          setEngineerTypes(
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
        console.error("Error fetching engineer types:", error);
        if (axios.isAxiosError(error) && error.response) {
          setAlert({
            message:
              error.response.data.message || "Error fetching engineer types:",
            type: "error",
          });
        }
      }
    }
    if (userType.code === "ENGINEER") {
      getEngineerTypes();
    }
  }, [pathUrl, userType.code]);

  // Fetch engineer services
  useEffect(() => {
    async function getEngineerServices(engineerTypeId: number) {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/engineer-services/service/${engineerTypeId}`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setEngineerServices(
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
        console.error("Error fetching engineer services:", error);
        setAlert({
          message: "Failed to fetch engineer services. Please try again.",
          type: "error",
        });
      }
    }
    if (formik.values.engineer.type.id) {
      getEngineerServices(formik.values.engineer.type.id);
    }
  }, [formik.values.engineer.type.id, pathUrl]);

  // Fetch technical worker types
  useEffect(() => {
    async function getTechnicalWorkerTypes() {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/technical-worker-types`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setTechnicalWorkerTypes(
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
        console.error("Error fetching technical worker types:", error);
        setAlert({
          message: "Failed to fetch technical worker types. Please try again.",
          type: "error",
        });
      }
    }
    if (userType.code === "TECHNICAL_WORKER") {
      getTechnicalWorkerTypes();
    }
  }, [pathUrl, userType.code]);

  // Fetch technical worker services
  useEffect(() => {
    async function getTechnicalWorkerServices(technicalWorkerTypeId: number) {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/technical-worker-services/service/${technicalWorkerTypeId}`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setTechnicalWorkerServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching technical worker services:", error);
        setAlert({
          message:
            "Failed to fetch technical worker services. Please try again.",
          type: "error",
        });
      }
    }
    if (formik.values.technicalWorker.type.id) {
      getTechnicalWorkerServices(formik.values.technicalWorker.type.id);
    }
  }, [formik.values.technicalWorker.type.id, pathUrl]);

  // Fetch business types
  useEffect(() => {
    async function getBusinessTypes() {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/business-types/user-type/${userType.id}`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setBusinessTypes(data.data);
        }
      } catch (error) {
        console.error("Error fetching business types:", error);
        setAlert({
          message: "Failed to fetch business types. Please try again.",
          type: "error",
        });
      }
    }
    if (
      (userType.code === "STORE" || userType.code === "EXHIBITION") &&
      userType.id > 0
    ) {
      getBusinessTypes();
    }
  }, [userType, pathUrl]);

  // Fetch governorates
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
      }
    }
    getGovernorates();
  }, [pathUrl]);

  // Fetch cities based on selected governorate
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
      }
    }

    if (selectedGovernorate) {
      getCities(selectedGovernorate);
    } else {
      setCities([]);
    }
  }, [selectedGovernorate, pathUrl]);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateForm,
  } = formik;

  const formKey = userType.code.toLowerCase() as keyof FormValues;
  const formValues = values[formKey] as IBusinessFormValues;
  const formErrors = errors[formKey] as FormikErrors<IBusinessFormValues>;
  const formTouched = touched[formKey] as FormikTouched<IBusinessFormValues>;

  // Handle first step form submission
  const handleRegisterFormSubmit = async (values: ISignUpForm) => {
    return new Promise<void>((resolve, reject) => {
      // Check if governorate is selected but city is not
      if (values.governorate?.id && (!values.city || !values.city.id)) {
        reject(new Error("Please select a city for the chosen governorate"));
        return;
      }

      setFormData((prevData) => ({ ...prevData, ...values }));
      setCurrentStep(2);
      resolve();
    }).catch((error) => {
      setAlert({
        message: error.message,
        type: "error",
      });
      throw error; // Re-throw to prevent form submission
    });
  };

  // Touch all fields in a nested object
  const touchAllFields = (obj: NestedObject, prefix = "") => {
    if (!obj) return;

    Object.keys(obj).forEach((key) => {
      const path = prefix ? `${prefix}.${key}` : key;

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        touchAllFields(obj[key] as NestedObject, path);
      } else {
        setFieldTouched(path, true, false);
      }
    });
  };

  // Handle signup form submission
  async function handleSignUp(values: FormValues) {
    // Validate form
    const validationErrors = await validateForm();

    // If there are validation errors, touch all fields to show error messages
    if (Object.keys(validationErrors).length > 0) {
      // Touch all fields based on user type
      if (userType.code === "ENGINEER") {
        touchAllFields(values.engineer, "engineer");
      } else if (userType.code === "TECHNICAL_WORKER") {
        touchAllFields(values.technicalWorker, "technicalWorker");
      } else if (userType.code === "STORE") {
        touchAllFields(values.store, "store");
      } else if (userType.code === "EXHIBITION") {
        touchAllFields(values.exhibition, "exhibition");
      }

      setAlert({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const baseData = {
        ...formData,
        userType,
      };

      const dataToSend: IDataToSend = {
        firstName: baseData.firstName,
        lastName: baseData.lastName,
        email: baseData.email,
        password: baseData.password,
        userType: baseData.userType,
        ...(baseData.phone && { phone: baseData.phone }),
        ...(baseData.rePassword && { rePassword: baseData.rePassword }),
        ...(formData.governorate && {
          governorate: { id: formData.governorate.id },
        }),
        ...(formData.city && { city: { id: formData.city.id } }),
      };

      if (userType.code === "ENGINEER") {
        dataToSend.engineer = {
          type: { id: values.engineer.type.id },
          yearsOfExperience: Number(values.engineer.yearsOfExperience),
          engineerServ: values.engineer.engineerServ,
        };
      } else if (userType.code === "TECHNICAL_WORKER") {
        dataToSend.technicalWorker = {
          type: { id: values.technicalWorker.type.id },
          yearsOfExperience: Number(values.technicalWorker.yearsOfExperience),
          workerServs: values.technicalWorker.workerServs,
        };
      } else if (userType.code === "STORE" || userType.code === "EXHIBITION") {
        const businessData =
          userType.code === "STORE" ? values.store : values.exhibition;
        dataToSend.business = {
          userType: { id: userType.id },
          tradName: businessData.tradName,
          bioAr: businessData.bioAr,
          bioEn: businessData.bioEn,
          businessTypes: businessData.businessTypes,
        };
      }

      if (!dataToSend.governorate?.id) delete dataToSend.governorate;
      if (!dataToSend.city?.id) delete dataToSend.city;
      if (!dataToSend.phone) delete dataToSend.phone;
      delete dataToSend.rePassword;

      console.log("Data to send:", dataToSend);

      const { data } = await axios.post(
        `${pathUrl}/api/v1/auth/register`,
        dataToSend,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      console.log("API Response:", data.data);
      navigate(`/access-account/${dataToSend.email}`);
    } catch (error) {
      console.error("Submission error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setAlert({
          message:
            error.response.data.message || "An error occurred during SignUp.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <CompanyAnimation />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md p-6">
          <AnimatePresence>
            {alert && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(null)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <RegisterForm
                  onSubmit={handleRegisterFormSubmit}
                  userType={userType}
                  btnText="Next"
                  initialValues={formData}
                  onChange={(values) => {
                    // Prevent unnecessary re-renders by using a functional update
                    setFormData((prevData) => {
                      // Only update if there are actual changes
                      if (
                        JSON.stringify(prevData) ===
                        JSON.stringify({ ...prevData, ...values })
                      ) {
                        return prevData;
                      }

                      // Update selectedGovernorate when governorate changes
                      if (values.governorate?.id !== selectedGovernorate) {
                        setSelectedGovernorate(values.governorate?.id || null);
                      }

                      return { ...prevData, ...values };
                    });
                  }}
                  governorates={governorates}
                  cities={cities}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid gap-4"
              >
                <form onSubmit={handleSubmit} className="grid gap-4">
                  {/* Engineer or Technical Worker Form */}
                  {(userType.code === "ENGINEER" ||
                    userType.code === "TECHNICAL_WORKER") && (
                    <div className="grid gap-2">
                      <Label htmlFor="yearsOfExperience">
                        Years of Experience
                      </Label>
                      <Input
                        id="yearsOfExperience"
                        name={
                          userType.code === "ENGINEER"
                            ? "engineer.yearsOfExperience"
                            : "technicalWorker.yearsOfExperience"
                        }
                        type="text"
                        value={
                          userType.code === "ENGINEER"
                            ? values.engineer.yearsOfExperience
                            : values.technicalWorker.yearsOfExperience
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          (userType.code === "ENGINEER"
                            ? errors.engineer?.yearsOfExperience
                            : errors.technicalWorker?.yearsOfExperience) &&
                          (userType.code === "ENGINEER"
                            ? touched.engineer?.yearsOfExperience
                            : touched.technicalWorker?.yearsOfExperience)
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {(userType.code === "ENGINEER"
                        ? errors.engineer?.yearsOfExperience
                        : errors.technicalWorker?.yearsOfExperience) &&
                        (userType.code === "ENGINEER"
                          ? touched.engineer?.yearsOfExperience
                          : touched.technicalWorker?.yearsOfExperience) && (
                          <p className="text-red-500 text-sm">
                            {userType.code === "ENGINEER"
                              ? errors.engineer?.yearsOfExperience
                              : errors.technicalWorker?.yearsOfExperience}
                          </p>
                        )}
                    </div>
                  )}

                  {/* Engineer Specific Form */}
                  {userType.code === "ENGINEER" ? (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="engineerType">Engineer Type</Label>
                        <Combobox
                          items={engineerTypes}
                          value={values.engineer.type.id}
                          onChange={(value) => {
                            setFieldValue("engineer.type.id", value);
                            setFieldValue("engineer.engineerServ", []);
                          }}
                          placeholder="Select Engineer Type"
                          error={errors.engineer?.type?.id as string}
                          touched={touched.engineer?.type?.id}
                        />
                        {errors.engineer?.type?.id &&
                          touched.engineer?.type?.id && (
                            <p className="text-red-500 text-sm">
                              {errors.engineer.type.id}
                            </p>
                          )}
                      </div>

                      {values.engineer.type.id !== 0 && (
                        <div className="grid gap-2">
                          <Label htmlFor="engineerServices">
                            Engineer Services
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {engineerServices.map((service) => (
                              <Card
                                key={service.id}
                                className="p-2 flex justify-between items-center"
                              >
                                <label
                                  htmlFor={`service-${service.id}`}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    id={`service-${service.id}`}
                                    checked={values.engineer.engineerServ.some(
                                      (s) => s.id === service.id
                                    )}
                                    onChange={(e) => {
                                      const updatedServices = e.target.checked
                                        ? [
                                            ...values.engineer.engineerServ,
                                            { id: service.id },
                                          ]
                                        : values.engineer.engineerServ.filter(
                                            (s) => s.id !== service.id
                                          );
                                      setFieldValue(
                                        "engineer.engineerServ",
                                        updatedServices
                                      );
                                    }}
                                    className="mr-2"
                                  />
                                  {service.name}
                                </label>
                              </Card>
                            ))}
                          </div>
                          {errors.engineer?.engineerServ &&
                            touched.engineer?.engineerServ && (
                              <p className="text-red-500 text-sm">
                                At least one engineer service is required
                              </p>
                            )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Technical Worker Specific Form */}
                      {userType.code === "TECHNICAL_WORKER" && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="technicalWorkerType">
                              Technical Worker Type
                            </Label>
                            <Combobox
                              items={technicalWorkerTypes}
                              value={values.technicalWorker.type.id}
                              onChange={(value) => {
                                // Only update if the value is actually changing
                                if (value !== values.technicalWorker.type.id) {
                                  setFieldValue(
                                    "technicalWorker.type.id",
                                    value
                                  );
                                  setFieldValue(
                                    "technicalWorker.workerServs",
                                    []
                                  );
                                }
                              }}
                              placeholder="Select Technical Worker Type"
                              error={errors.technicalWorker?.type?.id as string}
                              touched={touched.technicalWorker?.type?.id}
                            />
                            {errors.technicalWorker?.type?.id &&
                              touched.technicalWorker?.type?.id && (
                                <p className="text-red-500 text-sm">
                                  {errors.technicalWorker.type.id}
                                </p>
                              )}
                          </div>

                          {values.technicalWorker.type.id !== 0 && (
                            <div className="grid gap-2">
                              <Label htmlFor="technicalWorkerServices">
                                Technical Worker Services
                              </Label>
                              <div className="grid grid-cols-2 gap-2">
                                {technicalWorkerServices.map((service) => (
                                  <Card
                                    key={service.id}
                                    className="p-2 flex justify-between items-center"
                                  >
                                    <label
                                      htmlFor={`service-${service.id}`}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`service-${service.id}`}
                                        checked={values.technicalWorker.workerServs.some(
                                          (s) => s.id === service.id
                                        )}
                                        onChange={(e) => {
                                          const updatedServices = e.target
                                            .checked
                                            ? [
                                                ...values.technicalWorker
                                                  .workerServs,
                                                { id: service.id },
                                              ]
                                            : values.technicalWorker.workerServs.filter(
                                                (s) => s.id !== service.id
                                              );
                                          setFieldValue(
                                            "technicalWorker.workerServs",
                                            updatedServices
                                          );
                                        }}
                                        className="mr-2"
                                      />
                                      {service.name}
                                    </label>
                                  </Card>
                                ))}
                              </div>
                              {errors.technicalWorker?.workerServs &&
                                touched.technicalWorker?.workerServs && (
                                  <p className="text-red-500 text-sm">
                                    At least one technical worker service is
                                    required
                                  </p>
                                )}
                            </div>
                          )}
                        </>
                      )}

                      {/* Store or Exhibition Form */}
                      {(userType.code === "STORE" ||
                        userType.code === "EXHIBITION") && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="tradName">Trade Name</Label>
                            <Input
                              id="tradName"
                              name={`${formKey}.tradName`}
                              value={formValues.tradName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                formErrors?.tradName && formTouched?.tradName
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {formErrors?.tradName && formTouched?.tradName && (
                              <p className="text-red-500 text-sm">
                                {formErrors.tradName}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="bioAr">Arabic Bio</Label>
                            <Input
                              id="bioAr"
                              name={`${formKey}.bioAr`}
                              value={formValues.bioAr}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                formErrors?.bioAr && formTouched?.bioAr
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {formErrors?.bioAr && formTouched?.bioAr && (
                              <p className="text-red-500 text-sm">
                                {formErrors.bioAr}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="bioEn">English Bio</Label>
                            <Input
                              id="bioEn"
                              name={`${formKey}.bioEn`}
                              value={formValues.bioEn}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                formErrors?.bioEn && formTouched?.bioEn
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {formErrors?.bioEn && formTouched?.bioEn && (
                              <p className="text-red-500 text-sm">
                                {formErrors.bioEn}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="businessTypes">
                              Business Types
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {businessTypes.map((type) => (
                                <Card
                                  key={type.id}
                                  className="p-2 flex justify-between items-center"
                                >
                                  <label
                                    htmlFor={`businessType-${type.id}`}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`businessType-${type.id}`}
                                      checked={formValues.businessTypes.some(
                                        (t: { id: number }) => t.id === type.id
                                      )}
                                      onChange={(e) => {
                                        const updatedTypes = e.target.checked
                                          ? [
                                              ...formValues.businessTypes,
                                              { id: type.id },
                                            ]
                                          : formValues.businessTypes.filter(
                                              (t: { id: number }) =>
                                                t.id !== type.id
                                            );
                                        setFieldValue(
                                          `${formKey}.businessTypes`,
                                          updatedTypes
                                        );
                                      }}
                                      className="mr-2"
                                    />
                                    {type.name}
                                  </label>
                                </Card>
                              ))}
                            </div>
                            {formErrors?.businessTypes &&
                              formTouched?.businessTypes && (
                                <p className="text-red-500 text-sm">
                                  At least one business type is required
                                </p>
                              )}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Form Buttons */}
                  <div className="flex flex-col gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prevData) => ({
                          ...prevData,
                          ...formik.values,
                        }));
                        setCurrentStep(1);
                      }}
                      className="w-full btn secondary-grad"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative btn primary-grad"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Signing Up...</span>
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
