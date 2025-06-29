"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom"
import Sidebar from "./SidebarUser"

export default function Layout() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const getCurrentPageTitle = () => {
    if (location.pathname === "/" || location.pathname === "/orders") return "Orders"
    if (location.pathname === "/wishlist") return "Wishlist"
    if (location.pathname === "/profile") return "Profile"
    if (location.pathname === "/addresses") return "Addresses"
    if (location.pathname === "/payments") return "Payments"
    if (location.pathname === "/notifications") return "Notifications"
    return "Dashboard"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <Sidebar isMobile={true} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="flex items-center gap-4 p-4 bg-white border-b lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
        </div>

        {/* Page Content - This is where Outlet renders the child routes */}
        <main className="h-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
