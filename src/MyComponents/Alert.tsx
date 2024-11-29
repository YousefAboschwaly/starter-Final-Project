import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type: 'success' | 'error';
}

export function Alert({ message, isVisible, onClose, type }: AlertProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -50 }}
  transition={{ duration: 0.3 }}
  className="fixed w-full top-4 inset-0 z-50 flex justify-center items-start"
>
  <div
    className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}
    style={{ maxWidth: '100%', width: 'fit-content' }}
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

