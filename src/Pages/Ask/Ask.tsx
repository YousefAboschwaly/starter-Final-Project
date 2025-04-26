"use client"

import { useContext, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom"
import AskEngWorker from "./Ask-Eng-Worker"
import { UserContext } from "@/Contexts/UserContext"
import engineer1 from "/engineer1.jpg"
import engineer2 from "/engineer2.jpg"
import worker1 from "/worker1.jpg"
import worker2 from "/worker2.jpg"

export default function Ask() {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, pathUrl } = userContext

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [formType, setFormType] = useState<"engineer" | "worker" | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "engineer" || type === "worker") {
      setFormType(type)
    } else {
      // Redirect to home if no valid type is provided
      navigate("/")
    }
  }, [searchParams, navigate])

  // Handle step change from child component
  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  if (!formType) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Determine background image based on form type and current step
  const getBackgroundImage = () => {
    if (formType === "engineer") {
      return currentStep === 1 ? engineer1 : engineer2
    } else {
      return currentStep === 1 ? worker1 : worker2
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <motion.div
        className="w-full max-w-xl" // Increased from max-w-md to max-w-xl
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center">
              {formType === "engineer" ? "Ask to Engineer" : "Ask to Worker"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AskEngWorker formType={formType} userToken={userToken} pathUrl={pathUrl} onStepChange={handleStepChange} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
