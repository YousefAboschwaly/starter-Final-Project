import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { OTPVerificationForm } from "./OTPVerificationForm";
import Alert from "./Alert";
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
];

const ImageSlider: React.FC = () => {
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
          alt={`Work environment ${currentIndex + 1}`}
          className="absolute top-0 left-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function AccessAccount() {
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; show: boolean } | null>(null);
  let { email } = useParams();
  const navigate = useNavigate();
  
  async function handleOTPVerification(otp: string) {
    console.log(email);
    try {
      let { data } = await axios.post(
        `https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/auth/activate-the-account?email=${email}&otp=${otp}`,
        {},  // Empty object for request body
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      console.log(data);
      if (data.success) {
        setAlert({ message: data.data, type: 'success', show: true });
        setTimeout(() => {
          navigate("/client");
        }, 3000);
      }
      else {
        setAlert({ message: data.message, type: 'error', show: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({ message: error.response.data.message || "Invalid verification code.", type: 'error', show: true });
      } else {
        setAlert({ message: "An unexpected error occurred. Please try again.", type: 'error', show: true });
      }
    } 
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2">
        <ImageSlider />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {alert && (
            <Alert 
              message={alert.message} 
              type={alert.type}     
              isVisible={alert.show}
              onClose={() => setAlert(null)}
            />
          )}
          <OTPVerificationForm 
            onSubmit={handleOTPVerification}
            title="Access Email"
            subtitle="Enter the verification code we sent to your email"
            buttonText="Verify Code"
          />
        </div>
      </div>
    </div>
  );
}
