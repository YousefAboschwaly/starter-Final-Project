import { useEffect, useState } from "react";
import MidSect from "./MidSection/MidSect"
import ProductsSection from "./ProductsSection/ProductsSection"
import TopSect from "./TopSection/TopSect"
import { AnimatePresence } from "framer-motion";
import LoginAlert from "../Home/loginAlert";

export default function LandingPage() {
      const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    useEffect(()=>{
        if(localStorage.getItem('isLoggedIn')){
          setAlert({ message: "Login Successful. Welcome back to Home4U!", type: 'success' });
          setTimeout(() =>  {setAlert(null);localStorage.removeItem('isLoggedIn')} ,3000); 
    
        }
      
    },[])
  return (
    <main className="min-h-screen bg-gray-100">
      <TopSect/>
      <MidSect/>
      <ProductsSection/>
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
  )
}
