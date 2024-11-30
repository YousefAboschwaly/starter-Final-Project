'use client'
import React , { useContext, useState} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Eye, EyeOff, Loader2, X, Mail, LockKeyhole } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import axios from "axios"
import * as Yup from "yup"
import { UserContext } from "@/Contexts/UserContext"



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





interface ILogInForm {
  email: string
  password: string
}

export default function Login() {

  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  let navigate = useNavigate()
  // Use context and check for null
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { setUserToken } = userContext;
  let validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  })



  async function handleLogIn(formValues: ILogInForm) {
    setIsLoading(true);
    try {
      let { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signin`,
        formValues
      );
      if (data.message === "success") {
        localStorage.setItem('userToken' , data?.token)

        setAlert({ message: "Login Successful. Welcome back to Home4U!", type: 'success' });
        setTimeout(() => {navigate("/") ; setIsLoading(false); setUserToken( data?.token)}  , 3000);  // Small delay to show toaster before navigating
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({ message: error.response.data.message || "An error occurred during login.", type: 'error' });
        setTimeout(() =>  {setAlert(null); setIsLoading(false)}, 5000); 
      } else {
        setAlert({ message: "An unexpected error occurred. Please try again.", type: 'error' });
        setTimeout(() =>  {setAlert(null); setIsLoading(false)}, 5000); 
      }
    }
 
  }



  let { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
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
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      placeholder="Enter your Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-10 ${errors.email && touched.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && touched.email && (
                      <ErrorMessage message={errors.email} />
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
            src="../../public/Google.png"
            alt="Google"
            className="mr-2 h-6 w-6"
          />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full btn font-medium">
          <img
            src="../../public/Facebook.png"
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