import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { OTPVerificationForm } from "../MyComponents/OTPVerificationForm";
import { UserContext } from "@/Contexts/UserContext";


// API Configuration

// Validation Schemas
const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});

const newPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Password is required")
    .matches(/^.{8,}$/,"Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const imageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// Step Images
const stepImages = [
  "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
];

// Alert Component
interface AlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type: 'success' | 'error';
}


function Alert({ message, isVisible, onClose, type }: AlertProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed z-50 top-4 w-full "
          >
          <div className="text-center flex justify-center items-center">
            <div
              className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white`}
            >
              {type === 'success' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
              <span className="font-medium">{message}</span>
              <button
                onClick={onClose}
                className="ml-auto text-white hover:text-gray-200 focus:outline-none"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
// Progress Stepper Component
function ProgressStepper({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: string[];
}) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative flex justify-between">
        <div className="absolute top-4 left-0 w-full h-[2px] bg-muted -z-10" />
        
        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center z-10",
                currentStep > index
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep === index
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground"
              )}
            >
              {currentStep > index ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            <span
              className={cn(
                "text-xs mt-2",
                currentStep === index ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Email Step Component
function EmailStep({
  onNext,
  setAlert,
}: {
  onNext: (email: string) => void;
  setAlert: (alert: { show: boolean; message: string; type: "success" | "error" }) => void;
}) {

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { pathUrl} = userContext;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await axios.post(
          `${pathUrl}/api/v1/auth/send-otp?email=${values.email}`,
          {},
          {
            headers: { "Accept-Language": "en" },
          }
        );
        if (data.success) {
          setAlert({
            show: true,
            message: data.data || "Verification code sent successfully",
            type: "success",
          });
          setTimeout(() => onNext(values.email), 3000);
        } else {
          setAlert({ show: true, message: data.message, type: "error" });
        }
      } catch (err: any) {
        setAlert({
          show: true,
          message: err.response?.data?.message || "Failed to send verification code",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
        <p className="text-sm text-center text-gray-600">
          Enter your email to receive a verification code
        </p>
      </div>
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
        />
        <AnimatePresence>
          {(formik.touched.email && formik.errors.email) || error ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {formik.errors.email || error}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        onClick={(e) => {
          e.preventDefault(); // Prevent default form behavior
          formik.handleSubmit(); // Call the form submission
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Verification Code"
        )}
      </Button>
      <p className="text-sm text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Create a new account
        </Link>
      </p>
    </div>
  );
}


// Verification Step Component
function VerificationStep({ onNext, email, setAlert }: { onNext: (code: string) => void, email: string, setAlert: (alert: {show: boolean, message: string, type: 'success' | 'error'}) => void }) {

  const userContext = useContext(UserContext);
if (!userContext) {
  throw new Error("UserContext must be used within a UserContextProvider");
}
const { pathUrl} = userContext;
  const handleVerifyCode = async (code: string) => {
    try {
      const { data } = await axios.post(`${pathUrl}/api/v1/auth/activate-the-account?email=${email}&otp=${code}`, {}, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      if (data.success) {
        setAlert({show: true, message: data.data || "Verification successful", type: 'success'});
        setTimeout(() => onNext(code), 3000);
      } else {
        setAlert({show: true, message: data.message, type: 'error'});
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to verify code");
    }
  };

  return (
    <OTPVerificationForm
      onSubmit={handleVerifyCode}
      title="Verification Code"
      subtitle="Enter the verification code we sent to your email"
      buttonText="Verify Code"
    />
  );
}


// New Password Step Component
function NewPasswordStep({
  email,
  onNext,
  setAlert,
}: {
  email: string;
  onNext: (password: string) => void;
  setAlert: (alert: { show: boolean; message: string; type: "success" | "error" }) => void;
}) {

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { pathUrl} = userContext;

  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: newPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const { data } = await axios.put(
          `${pathUrl}/api/v1/auth/reset-password?email=${email}&newPassword=${formik.values.newPassword}`,
          {},
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        if (data.success) {
          setAlert({ show: true, message: data.data || "Password reset successful", type: "success" });
          setTimeout(() => {
            onNext(values.newPassword);
            navigate("/client");
          }, 3000);
        } else {
          setAlert({ show: true, message: data.message, type: "error" });
        }
      } catch (err: any) {
        setAlert({
          show: true,
          message: err.response?.data?.message || "Failed to reset password",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">New Password</h2>
        <p className="text-sm text-center text-gray-600">Enter your new password</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              placeholder="New password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pr-10 ${
                formik.touched.newPassword && formik.errors.newPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {formik.errors.newPassword}
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pr-10 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {formik.errors.confirmPassword}
            </motion.div>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        onClick={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </div>
  );
}

// Main component
export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const steps = ["Email", "Verify", "Password"];

  const handleNext = (stepData: any) => {
    switch (step) {
      case 1:
        setData({ ...data, email: stepData });
        setStep(2);
        break;
      case 2:
        setData({ ...data, verificationCode: stepData });
        setStep(3);
        break;
      case 3:
        setData({ ...data, newPassword: stepData });
        // The alert for the final step is now handled in the NewPasswordStep component
        break;
    }
  };


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Image */}
      <div className="hidden md:block w-1/2 relative bg-gray-100">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={step}
              src={stepImages[step - 1]}
              alt={`Step ${step} illustration`}
              className="w-full h-full object-cover"
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <ProgressStepper currentStep={step} steps={steps} />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && <EmailStep onNext={handleNext} setAlert={setAlert} />}
                {step === 2 && <VerificationStep onNext={handleNext} email={data.email} setAlert={setAlert} />}
                {step === 3 && (
                  <NewPasswordStep 
                    email={data.email} 
                    onNext={handleNext}
                    setAlert={setAlert}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <Alert
        message={alert.message}
        isVisible={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
        type={alert.type}
      />
    </div>
  );
}

