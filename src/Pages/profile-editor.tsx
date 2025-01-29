"use client"

import { useState, useRef } from "react"
import { ChevronLeft, Briefcase, Award, User, Link2, Mail, Phone, Eye, EyeOff, Upload, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ImageUpload } from "../MyComponents/image-upload"
import { FileUpload } from "../MyComponents/file-upload"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"

export default function ProfileEditor() {
  const navigate=useNavigate()

  const [activeTab, setActiveTab] = useState("basic")
  const [certificates, setCertificates] = useState<File[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [coverPhotoName, setCoverPhotoName] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)

  const basicRef = useRef<HTMLDivElement>(null)
  const certificationsRef = useRef<HTMLDivElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    const targetElement = document.getElementById(id)
    if (targetElement) {
      const yOffset = -80 // Adjust this value based on your header height
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setIsOpen(false) // Close sidebar immediately after clicking
    }
  }

  const NavButton = ({ id, label, icon: Icon }:{id:string,label:string,icon: React.ComponentType<{ className?: string }> }) => (
    <Button
      variant={activeTab === id ? "secondary" : "ghost"}
      className="w-full justify-start mb-1"
      onClick={() => scrollToSection(id)}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )

  const SidebarContent = () => (
    <nav className="space-y-1 p-2">
      <NavButton id="basic" label="Basic Information" icon={User} />
      <NavButton id="certifications" label="Certifications" icon={Award} />
      <NavButton id="bio" label="Bio" icon={Briefcase} />
      <NavButton id="links" label="Links" icon={Link2} />
    </nav>
  )

  const handleConfirmEdit = () => {
    toast.success("Profile updated successfully!", {
      duration: 2000,
      position: "top-center",
    })

    setTimeout(() => {
      navigate("/profile");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000)
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 pt-20">
      <div className="md:hidden fixed top-14 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to={'/profile'}>
          
          <Button
            variant="ghost"
            className="hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
           onClick={()=>window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to profile
          </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[240px,1fr] gap-6">
   


          <Card className="h-fit backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 sticky top-28 shadow-lg hidden md:block">
          <Link to={'/profile'} className="secondary-grad rounded-md hidden md:block">
            <Button
              variant="ghost"
              className="hover:bg-transparent backdrop-blur-sm w-full justify-start"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ChevronLeft className="w-4 h-4 mr-4" />
              Back to profile
            </Button>
          </Link>
            <SidebarContent />
          </Card>
        
 

          <div className="space-y-6">
            <Card
              ref={basicRef}
              id="basic"
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg overflow-hidden pt-20"
            >
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[200px,1fr] gap-8">
                  <div className="flex flex-col items-center space-y-4 mx-auto md:mx-0">
                    <ImageUpload
                      className="shadow-lg w-32 h-32 md:w-40 md:h-40"
                      onChange={(file) => console.log("Profile image:", file)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click to change profile picture</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label>Cover Photo</Label>
                      <div className="mt-1 relative">
                        <Input
                          type="text"
                          readOnly
                          value={coverPhotoName || ""}
                          placeholder="Cover Photo"
                          className="pr-10 cursor-pointer"
                          onClick={() => document.getElementById("coverPhotoInput")?.click()}
                        />
                        
                        <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          id="coverPhotoInput"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setCoverPhotoName(file.name)
                              console.log("Cover photo:", file)
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter first name" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter last name" className="mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input id="email" type="email" placeholder="Enter your email" className="pl-10 mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input id="phone" type="tel" placeholder="Enter phone number" className="pl-10 mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} className="mt-1 pr-10" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="mt-1 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-1/2 -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="governorate">Governorate (Optional)</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select governorate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cairo">Cairo</SelectItem>
                          <SelectItem value="giza">Giza</SelectItem>
                          <SelectItem value="alexandria">Alexandria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="city">City (Optional)</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="el-khalifa">EL-KHALIFA</SelectItem>
                          <SelectItem value="maadi">Maadi</SelectItem>
                          <SelectItem value="nasr-city">Nasr City</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="engineerType">Engineer Type</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Engineer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="civil">Civil Engineer</SelectItem>
                          <SelectItem value="mechanical">Mechanical Engineer</SelectItem>
                          <SelectItem value="electrical">Electrical Engineer</SelectItem>
                          <SelectItem value="software">Software Engineer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input id="experience" type="number" placeholder="Enter years of experience" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="services">Services</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="mobile">Mobile Development</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="mentoring">Mentoring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              ref={certificationsRef}
              id="certifications"
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg pt-20"
            >
              <CardHeader>
                <h2 className="text-xl font-semibold">Certifications</h2>
              </CardHeader>
              <CardContent>
                <FileUpload maxFiles={15} accept=".pdf,.jpg,.png" onChange={setCertificates} value={certificates} />
              </CardContent>
            </Card>

            <Card
              ref={bioRef}
              id="bio"
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg pt-20"
            >
              <CardHeader>
                <h2 className="text-xl font-semibold">Bio</h2>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Tell us about yourself..." className="min-h-[150px]" />
              </CardContent>
            </Card>

            <Card
              ref={linksRef}
              id="links"
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg pt-20"
            >
              <CardHeader>
                <h2 className="text-xl font-semibold">Links</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/username" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="behance">Behance Profile</Label>
                    <Input id="behance" type="url" placeholder="https://behance.net/username" className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleConfirmEdit}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-lg font-semibold shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
              >
                Confirm Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

