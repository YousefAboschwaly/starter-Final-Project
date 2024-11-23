
import * as React from "react"
import { Lock , X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Outlet } from "react-router-dom"


const Alert = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 p-4 rounded-md shadow-md flex items-center justify-between z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none">
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};
const BackgroundSlider = () => {
  const images = [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&auto=format&fit=crop&q=60",
  ]
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Home appliance ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 backdrop-blur-sm" />
    </div>
  )
}

const LoginAnimation = () => {
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
            <Lock className="w-16 h-16 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Welcome to Home4U</h2>
          <p className="text-xl">
            Your smart home ecosystem for household appliances and tools
          </p>
        </motion.div>
      </div>
    </div>
  )
}



export default function Client() {
 
  const [alert, setAlert] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  return (
    <>
      <AnimatePresence>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>
      
      <div className="flex min-h-screen">

      <div className="hidden md:block flex-1 relative overflow-hidden">
        <LoginAnimation />
      </div>


      <Outlet/>


      </div>
    </>
  )
}