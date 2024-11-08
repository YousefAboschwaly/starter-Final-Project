'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Mail, Lock, AlertCircle, Eye, EyeOff, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import axios from "axios"
import * as Yup from "yup"

const InputAnimation = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  touched?: boolean
}) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
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
        onClick={togglePasswordVisibility}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
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

interface ILogInForm {
  email: string
  password: string
}

export default function Login() {
  const [showAccounts, setShowAccounts] = React.useState(false)
  const [provider, setProvider] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [alert, setAlert] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  let navigate = useNavigate()

  let validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const handleProviderClick = (providerName: string) => {
    setProvider(providerName)
    setShowAccounts(true)
  }

  async function handleLogIn(formValues: ILogInForm) {
    setIsLoading(true);
    try {
      let { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signin`,
        formValues
      );
      if (data.message === "success") {
        setAlert({ message: "Login Successful. Welcome back to Home4U!", type: 'success' });
        setTimeout(() => {navigate("/") ; setIsLoading(false)}, 3000);  // Small delay to show toaster before navigating
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
      
      <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to Home4U
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <InputAnimation>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email && touched.email ? "border-red-500" : ""}
                  />
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
                  />
                  <AnimatePresence>
                    {errors.password && touched.password && (
                      <ErrorMessage message={errors.password} />
                    )}
                  </AnimatePresence>
                </div>
              </InputAnimation>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
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
              <h3 className="text-sm font-semibold mb-2">
                Select a {provider} account to log in with:
              </h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    {provider === "Google"
                      ? "example@gmail.com"
                      : "github_user1"}
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    {provider === "Google"
                      ? "another@gmail.com"
                      : "github_user2"}
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
          <div className="mt-4 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <LoginAnimation />
      </div>
      </div>
    </>
  )
}