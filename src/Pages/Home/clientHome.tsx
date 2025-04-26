import {  AnimatePresence } from "framer-motion"

import { useEffect, useState } from "react";
import LoginAlert from "./loginAlert";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";





export default function ClientHome() {
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  useEffect(()=>{
      if(localStorage.getItem('isLoggedIn')){
        setAlert({ message: "Login Successful. Welcome back to Home4U!", type: 'success' });
        setTimeout(() =>  {setAlert(null);localStorage.removeItem('isLoggedIn')} ,3000); 
  
      }
    
  },[])



  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-center mb-8">
          Construction Service Request
        </h1>
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/Ask?type=engineer")}
            className="w-full h-14 text-lg"
          >
            Ask Engineer
          </Button>
          <Button
            onClick={() => navigate("/Ask?type=worker")}
            className="w-full h-14 text-lg"
          >
            Ask Worker
          </Button>
        </div>
      </motion.div>
      <AnimatePresence>
        {alert && (
          <LoginAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
