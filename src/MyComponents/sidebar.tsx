"use client"

import { useState } from "react"
import { MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddServiceDialog } from "./add-service-dialog"
import { AddCertificateDialog } from "./add-certificate-dialog"
import ProfileImage from '/Profile_Picture.png'
import { Link } from "react-router-dom"

export function Sidebar() {
  const [isServicesDialogOpen, setIsServicesDialogOpen] = useState(false)
  const [isCertificationsDialogOpen, setIsCertificationsDialogOpen] = useState(false)
  const [services, setServices] = useState(Array(3).fill("Material and Finishing Selection"))
  const [certifications, setCertifications] = useState(Array(3).fill("Material and Finishing Selection.pdf"))

  const handleAddCertificates = (file: File) => {
    setCertifications([...certifications, file.name]);
  };

  return (
    <div className="relative w-full shrink-0 bg-white pt-24 md:w-[320px]">
      {/* Profile Image - Positioned half outside and larger */}
      <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 transform">
        <div className="h-full w-full overflow-hidden rounded-full border-4 border-white">
          <img src={ProfileImage} alt="Profile" width={180} height={180} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center space-y-2 p-4 pt-0">
        <h2 className="text-base font-medium">Yousef Mohamed </h2>
        <p className="text-sm text-gray-500">Interior designer</p>
        <div className="flex">
          {"★★★★☆".split("").map((star, i) => (
            <span key={i} className="text-yellow-400 text-[20px]">
              {star}
            </span>
          ))}
        </div>
        <Link to='/edit_profile'>

        <Button variant="outline" size="sm" className="mt-2 w-full rounded-lg text-[18px] py-5   primary-grad hover:text-white ">
          Edit Profile
        </Button>
        </Link>
      </div>

      {/* Sections with borders */}
      <div className="space-y-4 p-4">
        {/* Links Section */}
        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium">Links</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-500">
            <p className="truncate">https://www.behance.net/mohamed</p>
            <p className="truncate">https://www.instagram.com/mohamed</p>
          </div>
        </div>

        {/* About Section */}
        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium">About me</h3>
          <div className="mt-2 text-sm text-gray-600">
            An interior designer with experience in designing distinctive spaces.
          </div>
        </div>

        {/* Services Section */}
        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Services</h3>
            <button
              onClick={() => setIsServicesDialogOpen(true)}
              className="flex items-center text-xs text-gray-500 transition-colors hover:text-primary"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Services
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {services.map((service, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-gray-600">
                <span>• {service}</span>
                <button className="p-1 transition-colors hover:text-primary">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications Section */}
        <div className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Certifications</h3>
            <button
              onClick={() => setIsCertificationsDialogOpen(true)}
              className="flex items-center text-xs text-gray-500 transition-colors hover:text-primary"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Certifications
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {certifications.map((cert, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-gray-600">
                <span>• {cert}</span>
                <button className="p-1 transition-colors hover:text-primary">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AddServiceDialog
        open={isServicesDialogOpen}
        onOpenChange={setIsServicesDialogOpen}
        onAdd={(value) => setServices([...services, value])}
      />

      <AddCertificateDialog
        open={isCertificationsDialogOpen}
        onOpenChange={setIsCertificationsDialogOpen}
        onAdd={handleAddCertificates}
      />
    </div>
  )
}

