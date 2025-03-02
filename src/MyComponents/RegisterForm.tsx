import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Combobox } from "@/components/ui/combobox";

import { ReactNode } from "react";
import { UserContext } from "@/Contexts/UserContext";

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "any value";

export interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  rePassword: string;
  userType: {
    id: number;
    code: string;
  };
  governorate?: {
    id: number;
  };
  city?: {
    id: number;
  };
}

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder: string;
}

interface ILocation {
  id: number;
  code: string;
  name: string;
}

const InputAnimation = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

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

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${error && touched ? "border-red-500" : ""} pl-10 pr-10`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
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

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(/^.{8,}$/, "Password must be at least 8 characters long")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^01[0125][0-9]{8}$/, "Invalid phone number")
    .optional(),
  rePassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  governorate: Yup.object()
    .shape({
      id: Yup.number(),
    })
    .nullable(),
  city: Yup.object()
    .shape({
      id: Yup.number(),
    })
    .nullable(),
});

interface SignUpFormProps {
  onSubmit: (values: ISignUpForm) => Promise<void>;
}

export function RegisterForm({
  onSubmit,
  children,
  userType,
  btnText,
  initialValues = {},
  onChange = () => {},
}: {
  onSubmit: SignUpFormProps["onSubmit"];
  children?: ReactNode;
  userType: { id: number; code: string };
  btnText: string;
  initialValues?: Partial<ISignUpForm>;
  onChange?: (values: Partial<ISignUpForm>) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [governorates, setGovernorates] = useState<ILocation[]>([]);
  const [cities, setCities] = useState<ILocation[]>([]);

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const {  pathUrl} = userContext;

  const formik = useFormik<ISignUpForm>({
    initialValues: {
      firstName: initialValues.firstName || "",
      lastName: initialValues.lastName || "",
      email: initialValues.email || "",
      phone: initialValues.phone || "",
      password: initialValues.password || "",
      rePassword: initialValues.rePassword || "",
      userType: userType,
      governorate: initialValues.governorate,
      city: initialValues.city,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onSubmit(values);
      } catch (error) {
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
    },
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    handleSubmit,
    handleChange,
  } = formik;

  useEffect(() => {
    onChange(formik.values);
  }, [formik.values, onChange]);

  useEffect(() => {
    async function getGovernates() {
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/governorates`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setGovernorates(data.data);
        }
      } catch (error) {
        console.error("Error fetching governates:", error);
      }
    }
    getGovernates();
  }, [pathUrl]);

  useEffect(() => {
    async function getCities() {
      if (values.governorate?.id) {
        try {
          const { data } = await axios.get(
            `${pathUrl}/api/v1/cities/governorate/${values.governorate.id}`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          if (data.success) {
            setCities(data.data);
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      } else {
        setCities([]);
      }
    }
    getCities();
  }, [values.governorate,pathUrl]);

  return (
    <>
      <AnimatePresence>
        {alert && <Alert message={alert.message} type={alert.type} />}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <InputAnimation>
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.firstName && touched.firstName
                      ? "border-red-500"
                      : ""
                  }
                />
                <AnimatePresence>
                  {errors.firstName && touched.firstName && (
                    <ErrorMessage message={errors.firstName} />
                  )}
                </AnimatePresence>
              </div>
            </InputAnimation>

            <InputAnimation>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.lastName && touched.lastName ? "border-red-500" : ""
                  }
                />
                <AnimatePresence>
                  {errors.lastName && touched.lastName && (
                    <ErrorMessage message={errors.lastName} />
                  )}
                </AnimatePresence>
              </div>
            </InputAnimation>
          </div>

          <InputAnimation>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  w-4 h-4" />
                <Input
                  id="email"
                  placeholder="hello@example.com"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-10 ${
                    errors.email && touched.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && touched.email && (
                  <ErrorMessage message={errors.email} />
                )}
              </AnimatePresence>
            </div>
          </InputAnimation>

          <InputAnimation>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="phone number"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.phone && touched.phone ? "border-red-500" : ""
                }
              />
              <AnimatePresence>
                {errors.phone && touched.phone && (
                  <ErrorMessage message={errors.phone} />
                )}
              </AnimatePresence>
            </div>
          </InputAnimation>

          <InputAnimation>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                placeholder={`password`}
              />
              <AnimatePresence>
                {errors.password && touched.password && (
                  <ErrorMessage message={errors.password} />
                )}
              </AnimatePresence>
            </div>
          </InputAnimation>

          <InputAnimation>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <PasswordInput
                id="confirm-password"
                name="rePassword"
                value={values.rePassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.rePassword}
                touched={touched.rePassword}
                placeholder={`Confirm password`}
              />
              <AnimatePresence>
                {errors.rePassword && touched.rePassword && (
                  <ErrorMessage message={errors.rePassword} />
                )}
              </AnimatePresence>
            </div>
          </InputAnimation>

          <InputAnimation>
            <div className="grid gap-2">
              <Label htmlFor="governorate">Governorate (Optional)</Label>
              <Combobox
                items={governorates}
                value={values.governorate?.id}
                onChange={(value) => {
                  setFieldValue(
                    "governorate",
                    value ? { id: value } : undefined
                  );
                  setFieldValue("city", undefined);
                }}
                placeholder="Select governorate..."
                error={errors.governorate as string}
                touched={touched.governorate}
              />
            </div>
          </InputAnimation>

          <InputAnimation>
            <div className="grid gap-2">
              <Label htmlFor="city">City (Optional)</Label>
              <Combobox
                items={cities}
                value={values.city?.id}
                onChange={(value) =>
                  setFieldValue("city", value ? { id: value } : undefined)
                }
                placeholder="Select city..."
                disabled={!values.governorate}
                error={errors.city as string}
                touched={touched.city}
              />
            </div>
          </InputAnimation>

          <Button
            type="submit"
            disabled={isLoading}
            className="btn primary-grad"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {btnText === "Sign Up" ? "Signing Up..." : btnText}
              </>
            ) : (
              btnText
            )}
          </Button>
        </div>
      </form>
      {children}
    </>
  );
}
