'use client'
import React , { useContext, useState} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Eye, EyeOff, Loader2, Mail, LockKeyhole, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import axios from "axios"
import * as Yup from "yup"
import { UserContext } from "@/Contexts/UserContext"
import google from '/Google.png?url'
import facebook from '/Facebook.png'



interface PasswordInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  touched?: boolean
  placeholder: string
}

const InputAnimation = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}

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
)

const Alert = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  React.useEffect(() => {
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





interface ILogInForm {
  emailOrPhone: string 
  password: string
}

export default function Login() {

  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate()


  // Use context and check for null
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { setUserToken ,isMakeOtp ,setIsMakeOtp,pathUrl} = userContext;





  const validationSchema = Yup.object().shape({
    emailOrPhone: Yup.string().test(
      "email-or-phone", // Test name
      "Must be a valid email or phone number", // Validation error message
      (value) => {
        if (!value) return false; // Ensure it's not empty
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
        const phoneRegex = /^01[0125][0-9]{8}$/; // Phone number validation regex (e.g., +1234567890 or 1234567890)
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    )
    .required("Email or phone is required"),
    password: Yup.string().min(8,"Password must be at least 8 characters").required("Password is required"),
  })



  async function handleLogIn(formValues: ILogInForm) {
    setIsLoading(true);
    console.log(formValues)
    try {
      const { data } = await axios.post(
        `${pathUrl}/api/v1/auth/login`,
        formValues,{
          headers: {
            'Accept-Language':'en'
          }
        }
      );
      console.log(data)
      console.log(data.data.user.id)
      if (data.success ) {
        localStorage.setItem('isLoggedIn' , data.success)
        localStorage.setItem('userToken' , data.data.token)
        localStorage.setItem('user-RefreshToken' , data.data.refreshToken)
        localStorage.setItem('user-id' , data.data.user.id)
        localStorage.setItem('user-type' , data.data.user.userType.name)
        if(data.data.user.business){
          localStorage.setItem('user-business-id' , data.data.user.business.businessId
          )
        }
      
        if(isMakeOtp){

          navigate("/edit_profile") ; 
          setIsLoading(false);
           setUserToken( data.data.token)  // Small delay to show toaster before navigating
          setIsMakeOtp(false)
        }
        setIsLoading(false); 
        setUserToken( data.data.token);

        navigate("/") ;  
      }
    
    
       
        else{
        setAlert({ message: data.message, type: 'error' });
        setTimeout(() =>  {setAlert(null); setIsLoading(false)}, 3000); }
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error)
        if (error.response.data.message =='Your account is not enabled'){
          sendOtp()
        }
        setAlert({ message: error.response.data.message || "An error occurred during login.", type: 'error' });
        setTimeout(() =>  {setAlert(null); setIsLoading(false)}, 5000); 
      } 
   
      
    }
 
  }

  
async function sendOtp() {
  try {
    const { data } = await axios.post(
      `${pathUrl}/api/v1/auth/send-otp?email=${values.emailOrPhone}`,
      {},{
        headers: {
          'Accept-Language':'en'
        }
      }
    );
    console.log(data)
    if (data.success ) {

      setAlert({ message: data.data, type: 'success' });
      setTimeout(() => { navigate( `/access-account/${values.emailOrPhone}`)
      ; setIsLoading(false)}  , 3000);  // Small delay to show toaster before navigating
    }
  
  

    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log(error)
  
      setAlert({ message: error.response.data.message || "An error occurred during login.", type: 'error' });
      setTimeout(() =>  {setAlert(null); setIsLoading(false)}, 5000); 
    } 
 
}
}


  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        emailOrPhone: "",
        password: "",
      },
      validationSchema,
      onSubmit: handleLogIn,
    })

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

      
  

      <div className="flex-1 flex items-center justify-center py-2 bg-background">
        <Card className="w-full max-w-md p-6">


          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
            <InputAnimation>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email or Phone</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      placeholder="Enter your Email or Phone"
                      name="emailOrPhone"
                      type='text'
                      value={values.emailOrPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-10 ${errors.emailOrPhone && touched.emailOrPhone ? "border-red-500" : ""}`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.emailOrPhone && touched.emailOrPhone && (
                      <ErrorMessage message={errors.emailOrPhone} />
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
                        placeholder="password"
                      />
                      {errors.password && touched.password && (
                        <ErrorMessage message={errors.password} />
                      )}
                    </div>
              </InputAnimation>



              <div className="text-right">
        <Link to="/forgot-password" className="text-sm text-primary hover:underline btn font-medium">
          forgot password?
        </Link>
      </div>
              <Button type="submit" disabled={isLoading} className="btn primary-grad">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </div>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-2">
        <Button variant="outline" className="w-full btn font-medium">
          <img
            src={google}
            alt="Google"
            className="mr-2 h-6 w-6"
          />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full btn font-medium">
          <img
            src={facebook}
            alt="Facebook"
            className="mr-2 h-6 w-6"
          />
          Continue with Facebook
        </Button>
      </div>

        
        </Card>
      </div>
 
    </>
  )
}

