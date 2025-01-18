import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect } from 'react';

interface AlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type: 'success' | 'error';
}

export default function Alert({ message, isVisible, onClose, type }: AlertProps) {
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
          className="fixed z-50 top-4 left-0 right-0 "
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
