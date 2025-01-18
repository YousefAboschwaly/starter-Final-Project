import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { RegisterForm, ISignUpForm } from "../../MyComponents/RegisterForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";

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
  }, []);

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
              repeat: Infinity,
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

const validationSchema = Yup.object().shape({
  engineer: Yup.object().shape({
    type: Yup.object().shape({
      id: Yup.number().required("Engineer type is required"),
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

  technicalWorker: Yup.object().when("userType.code", {
    is: "TECHNICAL_WORKER",
    then: () =>
      Yup.object().shape({
        type: Yup.object().shape({
          id: Yup.number().required("Technical worker type is required"),
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
    otherwise: () => Yup.object().strip(),
  }),
  userType: Yup.object().shape({
    id: Yup.number().required("User type is required"),
    code: Yup.string().required("User type code is required"),
  }),
});

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
    ISignUpForm & IEngineerForm & ITechnicalWorkerForm
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
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const formik = useFormik<IEngineerForm & ITechnicalWorkerForm>({
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
    },
    validationSchema,
    onSubmit: () => {}, // Empty function as we're handling submission manually
  });

  useEffect(() => {
    async function getUserTypes() {
      try {
        const { data } = await axios.get(
          "https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/user-types",
          {
            headers: { "Accept-Language": "en" },
          }
        );
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
  }, []);

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

  useEffect(() => {
    async function getEngineerTypes() {
      try {
        const { data } = await axios.get(
          "https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/engineer-types",
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setEngineerTypes(
            data.data.map((item: any) => ({
              id: item.id,
              code: item.code || "",
              name: item.name,
            }))
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
    getEngineerTypes();
  }, []);

  useEffect(() => {
    async function getEngineerServices(engineerTypeId: number) {
      try {
        const { data } = await axios.get(
          `https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/engineer-services/service/${engineerTypeId}`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setEngineerServices(
            data.data.map((item: any) => ({
              id: item.id,
              code: item.code || "",
              name: item.name,
            }))
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
  }, [formik.values.engineer.type.id]);

  async function getTechnicalWorkerTypes() {
    try {
      const { data } = await axios.get(
        "https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/technical-worker-types",
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      if (data.success) {
        setTechnicalWorkerTypes(
          data.data.map((item: any) => ({
            id: item.id,
            code: item.code || "",
            name: item.name,
          }))
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

  useEffect(() => {
    getTechnicalWorkerTypes();
  }, []);

  async function getTechnicalWorkerServices(technicalWorkerTypeId: number) {
    try {
      const { data } = await axios.get(
        `https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/technical-worker-services/service/${technicalWorkerTypeId}`,
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
        message: "Failed to fetch technical worker services. Please try again.",
        type: "error",
      });
    }
  }

  useEffect(() => {
    if (formik.values.technicalWorker.type.id) {
      getTechnicalWorkerServices(formik.values.technicalWorker.type.id);
    }
  }, [formik.values.technicalWorker.type.id]);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setFieldValue,
  } = formik;

  async function handleSignUp(values: IEngineerForm & ITechnicalWorkerForm) {
    setIsLoading(true);
    setAlert(null);
    try {
      const dataToSend: any = {
        ...formData,
        userType: userType,
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
      }

      // Remove unnecessary fields
      if (userType.code !== "ENGINEER") {
        delete dataToSend.engineer;
      }
      if (userType.code !== "TECHNICAL_WORKER") {
        delete dataToSend.technicalWorker;
      }

      if (!dataToSend.governorate?.id) delete dataToSend.governorate;
      if (!dataToSend.city?.id) delete dataToSend.city;
      if (!dataToSend.phone) delete dataToSend.phone;

      // Remove the rePassword field from the data to be sent
      delete dataToSend.rePassword;

      console.log("Data to send:", dataToSend);

      const { data } = await axios.post(
        "https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/auth/register",
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

  const handleRegisterFormSubmit = async (values: ISignUpForm) => {
    return new Promise<void>((resolve) => {
      setFormData((prevData) => ({ ...prevData, ...values }));
      setCurrentStep(2);
      resolve();
    });
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <CompanyAnimation />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md p-6">
          <AnimatePresence>
            {alert && <Alert message={alert.message} type={alert.type} />}
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
                  onChange={(values) =>
                    setFormData((prevData) => ({ ...prevData, ...values }))
                  }
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
                      <div className="grid gap-2">
                        <Label htmlFor="technicalWorkerType">
                          Technical Worker Type
                        </Label>
                        <Combobox
                          items={technicalWorkerTypes}
                          value={values.technicalWorker.type.id}
                          onChange={(value) => {
                            setFieldValue("technicalWorker.type.id", value);
                            setFieldValue("technicalWorker.workerServs", []);
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
                                      const updatedServices = e.target.checked
                                        ? [
                                            ...values.technicalWorker.workerServs,
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
                                At least one technical worker service is required
                              </p>
                            )}
                        </div>
                      )}
                    </>
                  )}

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
                      type="button"
                      disabled={isLoading}
                      className="w-full relative btn primary-grad"
                      onClick={() => {
                        handleSubmit();
                        handleSignUp(values as IEngineerForm & ITechnicalWorkerForm);
                      }}
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

