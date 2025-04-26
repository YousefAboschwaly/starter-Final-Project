import { useEffect } from "react";
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from "lucide-react";

 const LoginAlert = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed z-50 top-4 left-0 right-0 flex justify-center items-center `}
    >
<div className="text-center flex justify-center items-center">
<div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {type === 'success' ? (
              <CheckCircle2  className="w-6 h-6" />
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
  );
};

export default LoginAlert;