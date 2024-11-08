

import React,{ useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Mail, AlertCircle, Eye, EyeOff, Loader2,X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import axios from "axios"
import * as Yup from "yup"

interface ISignUpForm {
  name: string
  email: string
  phone:string
  password: string
  rePassword: string
}

interface PasswordInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  touched?: boolean
}

const InputAnimation = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)

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



const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent form submission
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${error && touched ? "border-red-500" : ""} pr-10`}
      />
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={togglePasswordVisibility }
        className={`absolute right-2 top-2   text-gray-500 hover:text-gray-700 focus:outline-none`}
        aria-label={showPassword ? "Hide password" : "Show password"}

      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </motion.button>
    </div>
  )
}

const Home4UAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const items = [
    { src: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&auto=format&fit=crop&q=60", alt: "Modern Kitchen Appliances" },
    { src: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&auto=format&fit=crop&q=60", alt: "Smart Home Devices" },
    { src: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=60", alt: "Vacuum Cleaner" },
    { src: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&auto=format&fit=crop&q=60", alt: "Home Entertainment System" },
    { src: "https://images.unsplash.com/photo-1632829882891-5047ccc421bc?w=800&auto=format&fit=crop&q=60", alt: "Power Tools" },
    { src: "https://images.unsplash.com/photo-1507207611509-ec012433ff52?w=800&auto=format&fit=crop&q=60", alt: "Smart Thermostat" },
    { src: "https://images.unsplash.com/photo-1632829882891-5047ccc421bc?w=800&auto=format&fit=crop&q=60", alt: "Power Tools" },
    { src: "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=800&auto=format&fit=crop&q=60", alt: "Coffee Maker" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop&q=60')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={items[currentIndex].src}
              alt={items[currentIndex].alt}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent " />
      <motion.div
        className="absolute inset-x-0 bottom-0 p-8"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Welcome to Home4U</h2>
        </div>
        <p className="text-xl text-white text-center">Your one-stop shop for home appliances and smart devices</p>
      </motion.div>
    </div>
  )
}


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

export default function SignUp() {
  const [showAccounts, setShowAccounts] = useState(false)
  const [provider, setProvider] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  let navigate = useNavigate()

  let validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().matches(/^[A-Z].{5,8}$/,'password must start with capital character and from  5 to 8 characters')
      .required("Password is required"),
    phone:Yup.string().matches(/^01[0125][0-9]{8}$/ , 'Invalid Phone number').required("Phone is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password')], "Passwords must match")
      .required("Please confirm your password"),
  })

  async function handleSignup(formValues: ISignUpForm) {
    setIsLoading(true)
    try {
      let { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
        formValues
      )
      if (data.message === "success") {
        setAlert({ message: "SignUp Successful. Welcome to Home4U!", type: 'success' });
        setTimeout(() => {navigate("/") ; setIsLoading(false)}, 3000);  // Small delay to show toaster before navigating
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAlert({ message: error.response.data.message || "An error occurred during SignUp.", type: 'error' });
        setTimeout(() =>  {setAlert(null); setIsLoading(false)}, 5000); 
      } else {
        setAlert({ message: "An unexpected error occurred. Please try again.", type: 'error' });
        setTimeout(() =>  {setAlert(null); setIsLoading(false)}, 5000); 
      }
    }
  }

  const { handleChange, handleBlur, values, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: handleSignup,
  })
  

  const handleProviderClick = (providerName: string) => {
    setProvider(providerName)
    setShowAccounts(true)
  }

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
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Sign up for Home4U</h1>
            <p className="text-sm text-muted-foreground">Your one-stop shop for home appliances and smart devices</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <InputAnimation>
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input
                    id="full-name"
                    placeholder="Enter name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.name && touched.name ? "border-red-500" : ""}
                  />
                  <AnimatePresence>
                    {errors.name && touched.name && <ErrorMessage message={errors.name} />}
                  </AnimatePresence>
                </div>
              </InputAnimation>

              <InputAnimation>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    placeholder="hello@example.com"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email && touched.email ? "border-red-500" : ""}
                  />
                  <AnimatePresence>
                    {errors.email && touched.email && <ErrorMessage message={errors.email} />}
                  </AnimatePresence>
                </div>
              </InputAnimation>

              <InputAnimation>
                <div className="grid gap-2">
                  <Label htmlFor="phone">phone </Label>
                  <Input
                    id="phone"
                    placeholder="01010203040"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.phone && touched.phone ? "border-red-500" : ""}
                  />
                  <AnimatePresence>
                    {errors.phone && touched.phone && <ErrorMessage message={errors.phone} />}
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
                  />
                  <AnimatePresence>
                    {errors.password && touched.password && <ErrorMessage message={errors.password} />}
                  </AnimatePresence>
                </div>
              </InputAnimation>

              <InputAnimation>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <PasswordInput
                    id="confirm-password"
                    name="rePassword"
                    value={values.rePassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.rePassword}
                    touched={touched.rePassword}
                  />
                  <AnimatePresence>
                    {errors.rePassword && touched.rePassword && <ErrorMessage message={errors.rePassword} />}
                  </AnimatePresence>
                </div>
              </InputAnimation>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleProviderClick("Google")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleProviderClick("GitHub")}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
          {showAccounts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 p-4 bg-muted rounded-md"
            >
              <h3 className="text-sm font-semibold mb-2">Select a {provider} account to sign up with:</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    {provider === "Google" ? "example@gmail.com" : "github_user1"}
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    {provider === "Google" ? "another@gmail.com" : "github_user2"}
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    Use another account
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </Card>
      </div>
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <Home4UAnimation />
      </div>
    </div>
    </>
  )
}
