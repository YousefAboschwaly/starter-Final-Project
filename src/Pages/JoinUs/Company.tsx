"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Eye, EyeOff, Loader2, Mail, LockKeyhole, CloudUpload, Briefcase } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormik } from "formik"
import * as Yup from "yup"

interface ICompanyForm {
  firstName: string
  lastName: string
  tradeName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  governorate: string
  city: string
  scopeOfWork: string
  accountType: string
  bio: string
  services: string
  sections: string
  commercialRegister: File | null
  taxCard: File | null
  personalCard: File | null
  coverPhoto: File | null
}

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

const FileUploadField = ({ label, name, value, onChange, error, touched }: { 
  label: string
  name: string
  value: File | null
  onChange: (file: File) => void
  error?: string
  touched?: boolean
}) => (
  <div className="grid gap-2">
    <Label className="text-sm font-medium">{label}</Label>
    <div 
      className={`flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-primary ${
        error && touched ? "border-red-500" : ""
      }`}
      onClick={() => document.getElementById(name)?.click()}
    >
      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
        {value ? value.name : `${label}`}
      </span>
      <CloudUpload className="h-5 w-5 flex-shrink-0 ml-2" />
    </div>
    <Input
      type="file"
      id={name}
      name={name}
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) onChange(file)
      }}
      className="hidden"
    />
    {error && touched && <ErrorMessage message={error} />}
  </div>
)

const BackgroundSlider = () => {
  const images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=60",
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
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
          alt={`Business image ${currentIndex + 1}`}
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

const CompanyAnimation = () => {
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
            <Briefcase className="w-16 h-16 text-primary" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Platform</h2>
          <p className="text-xl">
            Register your company and start growing your business today
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function Company() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    tradeName: Yup.string().required("Trade name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Invalid phone number")
      .required("Phone is required"),
    password: Yup.string()
      .matches(
        /^[A-Z].{5,8}$/,
        "Password must start with a capital letter and be 6-9 characters long"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    governorate: Yup.string().required("Governorate is required"),
    city: Yup.string().required("City is required"),
    scopeOfWork: Yup.string().required("Scope of work is required"),
    accountType: Yup.string().required("Account type is required"),
    bio: Yup.string().required("Bio is required"),
    services: Yup.string().required("Services are required"),
    sections: Yup.string().required("Section is required"),
    commercialRegister: Yup.mixed().nullable().required("Commercial Register is required"),
    taxCard: Yup.mixed().nullable().required("Tax Card is required"),
    personalCard: Yup.mixed().nullable().required("Personal Card is required"),
    coverPhoto: Yup.mixed().nullable().required("Cover Photo is required"),
  })

  const formik = useFormik<ICompanyForm>({
    initialValues: {
      firstName: "",
      lastName: "",
      tradeName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      governorate: "",
      city: "",
      scopeOfWork: "",
      accountType: "",
      bio: "",
      services: "",
      sections: "",
      commercialRegister: null,
      taxCard: null,
      personalCard: null,
      coverPhoto: null
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
          if (value !== null) {
            if (value instanceof File) {
              formData.append(key, value, value.name)
            } else {
              formData.append(key, value)
            }
          }
        })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log("Form submitted:", Object.fromEntries(formData))
        setSuccessMessage("Company registration successful!")
        
      } catch (error) {
        console.error("Submission error:", error)
      } finally {
        setIsLoading(false)
      }
    }
  })

  const { handleSubmit, handleChange, handleBlur, values, errors, touched, setFieldValue } = formik

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <CompanyAnimation />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        <Card className="w-full max-w-md p-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid gap-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputAnimation>
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.firstName && touched.firstName ? "border-red-500" : ""}
                          placeholder="First Name"
                        />
                        {errors.firstName && touched.firstName && (
                          <ErrorMessage message={errors.firstName} />
                        )}
                      </div>
                    </InputAnimation>

                    <InputAnimation>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.lastName && touched.lastName ? "border-red-500" : ""}
                          placeholder="Last Name"
                        />
                        {errors.lastName && touched.lastName && (
                          <ErrorMessage message={errors.lastName} />
                        )}
                      </div>
                    </InputAnimation>
                  </div>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="tradeName">Trade Name</Label>
                      <Input
                        id="tradeName"
                        name="tradeName"
                        value={values.tradeName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.tradeName && touched.tradeName ? "border-red-500" : ""}
                        placeholder="Trade Name"
                      />
                      {errors.tradeName && touched.tradeName && (
                        <ErrorMessage message={errors.tradeName} />
                      )}
                    </div>
                  </InputAnimation>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label
>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`pl-10 ${errors.email && touched.email ? "border-red-500" : ""}`}
                          placeholder="Email "
                        />
                      </div>
                      {errors.email && touched.email && (
                        <ErrorMessage message={errors.email} />
                      )}
                    </div>
                  </InputAnimation>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.phone && touched.phone ? "border-red-500" : ""}
                        placeholder="phone number"
                      />
                      {errors.phone && touched.phone && (
                        <ErrorMessage message={errors.phone} />
                      )}
                    </div>
                  </InputAnimation>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="governorate">Governorate</Label>
                      <Select
                        name="governorate"
                        value={values.governorate}
                        onValueChange={(value) => setFieldValue("governorate", value)}
                      >
                        <SelectTrigger className={errors.governorate && touched.governorate ? "border-red-500 " : ""}>
                          <SelectValue placeholder="Select Governorate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cairo">Cairo</SelectItem>
                          <SelectItem value="alexandria">Alexandria</SelectItem>
                          <SelectItem value="giza">Giza</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.governorate && touched.governorate && (
                        <ErrorMessage message={errors.governorate} />
                      )}
                    </div>
                  </InputAnimation>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        name="city"
                        value={values.city}
                        onValueChange={(value) => setFieldValue("city", value)}
                      >
                        <SelectTrigger className={errors.city && touched.city ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nasrCity">Nasr City</SelectItem>
                          <SelectItem value="heliopolis">Heliopolis</SelectItem>
                          <SelectItem value="maadi">Maadi</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.city && touched.city && (
                        <ErrorMessage message={errors.city} />
                      )}
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

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                        placeholder="Confirm password"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <ErrorMessage message={errors.confirmPassword} />
                      )}
                    </div>
                  </InputAnimation>

                  <Button
                    type="button"
                    onClick={() => {
                      const firstStepFields: (keyof typeof values)[] = [
                        "firstName",
                        "lastName",
                        "tradeName",
                        "email",
                        "phone",
                        "governorate",
                        "city",
                        "password",
                        "confirmPassword",
                      ];

                      const hasErrors = firstStepFields.some((field) => errors[field]);
                      const hasEmptyFields = firstStepFields.some((field) => !values[field]);

                      if (hasErrors || hasEmptyFields) {
                        firstStepFields.forEach((field) => {
                          formik.setFieldTouched(field, true, true);
                        });
                        return;
                      }

                      setCurrentStep(2);
                    }}
                    className="w-full btn primary-grad"
                  >
                    Next
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid gap-4"
                >

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="scopeOfWork">Scope of Work</Label>
                      <Select
                        name="scopeOfWork"
                        value={values.scopeOfWork}
                        onValueChange={(value) => setFieldValue("scopeOfWork", value)}
                      >
                        <SelectTrigger className={errors.scopeOfWork && touched.scopeOfWork ? "border-red-500 placeholder-slate-400" : ""}>
                          <SelectValue placeholder="Scope of Work"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.scopeOfWork && touched.scopeOfWork && (
                        <ErrorMessage message={errors.scopeOfWork} />
                      )}
                    </div>
                  </InputAnimation>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select
                        name="accountType"
                        value={values.accountType}
                        onValueChange={(value) => setFieldValue("accountType", value)}
                      >
                        <SelectTrigger className={errors.accountType && touched.accountType ? "border-red-500" : ""}>
                          <SelectValue placeholder="Choose your account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.accountType && touched.accountType && (
                        <ErrorMessage message={errors.accountType} />
                      )}
                    </div>
                  </InputAnimation>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        name="bio"
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.bio && touched.bio ? "border-red-500" : ""}
                        placeholder="Enter the bio"
                      />
                      {errors.bio && touched.bio && (
                        <ErrorMessage message={errors.bio} />
                      )}
                    </div>
                  </InputAnimation>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="services">Services</Label>
                      <Input
                        id="services"
                        name="services"
                        value={values.services}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.services && touched.services ? "border-red-500" : ""}
                        placeholder="Enter the services"
                      />
                      {errors.services && touched.services && (
                        <ErrorMessage message={errors.services} />
                      )}
                    </div>
                  </InputAnimation>

                  <div className="grid gap-4">
                    <FileUploadField
                      label="Commercial Register"
                      name="commercialRegister"
                      value={values.commercialRegister}
                      onChange={(file) => setFieldValue("commercialRegister", file)}
                      error={errors.commercialRegister}
                      touched={touched.commercialRegister}
                    />
                    <FileUploadField
                      label="Tax Card"
                      name="taxCard"
                      value={values.taxCard}
                      onChange={(file) => setFieldValue("taxCard", file)}
                      error={errors.taxCard}
                      touched={touched.taxCard}
                    />
                    <FileUploadField
                      label="Personal Card"
                      name="personalCard"
                      value={values.personalCard}
                      onChange={(file) => setFieldValue("personalCard", file)}
                      error={errors.personalCard}
                      touched={touched.personalCard}
                    />
                    <FileUploadField
                      label="Cover Photo"
                      name="coverPhoto"
                      value={values.coverPhoto}
                      onChange={(file) => setFieldValue("coverPhoto", file)}
                      error={errors.coverPhoto}
                      touched={touched.coverPhoto}
                    />
                  </div>

                  <InputAnimation>
                    <div className="grid gap-2">
                      <Label htmlFor="sections">Sections</Label>
                      <Select
                        name="sections"
                        value={values.sections}
                        onValueChange={(value) => setFieldValue("sections", value)}
                      >
                        <SelectTrigger className={errors.sections && touched.sections ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="section1">Section 1</SelectItem>
                          <SelectItem value="section2">Section 2</SelectItem>
                          <SelectItem value="section3">Section 3</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.sections && touched.sections && (
                        <ErrorMessage message={errors.sections} />
                      )}
                    </div>
                  </InputAnimation>

                  <div className="flex flex-col gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="w-full btn secondary-grad"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative btn primary-grad"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Signing Up...</span>
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Card>
      </div>
    </div>
  )
}

