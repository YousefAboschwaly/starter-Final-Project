import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

// API Configuration
const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

// Validation Schemas
const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});

const newPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
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
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
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
function EmailStep({ onNext }: { onNext: (email: string) => void }) {
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
        const response = await axios.post(`${BASE_URL}/auth/forgotPasswords`, {
          email: values.email,
        });
        if (response.data.statusMsg === "success") {
          onNext(values.email);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to send verification code"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-normal text-center btn mb-7">
          Forget Password
        </h2>
        <div className="space-y-2">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            }
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
      </div>

      <Button
        type="submit"
        className="w-full btn primary-grad py-4"
        disabled={isLoading}
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

      <p className="text-sm text-center btn">
        <span className="font-light text-base">Don't have an account? </span>
        <Link
          to="/signup"
          className="hover:underline font-medium text-lg text-[#2D2D4C]"
        >
          Create a new account
        </Link>
      </p>
    </form>
  );
}

// Verification Step Component
function VerificationStep({ onNext }: { onNext: (code: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatically focus on the first input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  async function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/verifyResetCode`, {
        resetCode: code,
      });
      if (data.status === "Success") {
        onNext(code);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-center">
          Verification Code
        </h2>
        <p className="text-sm text-center text-gray-600">
          Enter the verification code we sent to your email
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={code}
          onChange={(value: string) => setCode(value)}
        >
          <InputOTPGroup className="flex justify-center items-center gap-2">
            <InputOTPSlot index={0} ref={inputRef} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm flex items-center justify-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </motion.div>
      )}

      <Button
        type="submit"
        className="w-full btn primary-grad"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Code"
        )}
      </Button>
    </form>
  );
}


// New Password Step Component
function NewPasswordStep({
  email,
  onNext,
  onError,
}: {
  email: string;
  onNext: (password: string) => void;
  onError: (message: string) => void;
}) {
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
        const response = await axios.put(`${BASE_URL}/auth/resetPassword`, {
          email,
          newPassword: values.newPassword,
        });
        if (response.data.token) {
          onNext(values.newPassword);
          setTimeout(() => {setIsLoading(false);navigate("/client")}, 4000);
        }
      } catch (err: any) {
        onError(err.response?.data?.message || "Failed to reset password");
        setIsLoading(false);

      } 
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">New Password</h2>
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
                formik.touched.newPassword && formik.errors.newPassword
                  ? "border-red-500"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPasswords.new ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
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
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  confirm: !showPasswords.confirm,
                })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
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
        className="w-full btn primary-grad"
        disabled={isLoading}
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
    </form>
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
        setAlert({
          show: true,
          message: "Password Reset Successful! Your password has been successfully reset.",
          type: 'success'
        });
        setTimeout(() => {
          setAlert({ ...alert, show: false });
          // Handle successful password reset (e.g., redirect to login)
        }, 3000);
        break;
    }
  };

  const handleError = (message: string) => {
    setAlert({ show: true, message, type: 'error' });
  };

  return (
    <div className="min-h-screen flex bg-background">
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
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <ProgressStepper currentStep={step} steps={steps} />

          <Card className="w-full max-w-md p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {step === 1 && <EmailStep onNext={handleNext} />}
                {step === 2 && <VerificationStep onNext={handleNext} />}
                {step === 3 && (
                  <NewPasswordStep 
                    email={data.email} 
                    onNext={handleNext}
                    onError={handleError}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
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

