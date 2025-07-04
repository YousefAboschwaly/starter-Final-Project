"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, CreditCard, Heart, User, MapPin, Bell, X, LogOut } from "lucide-react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { UserContext } from "@/Contexts/UserContext"
import { useContext } from "react"

interface SidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate()
   const userContext = useContext(UserContext)
    if (!userContext) {
      throw new Error("UserContext must be used within a UserContextProvider")
    }
    const {  logout } = userContext


  const location = useLocation()

  const sidebarItems = [
    { icon: Package, label: "Orders", key: "Orders", path: "/orders" },
    { icon: Heart, label: "Wishlist", key: "Wishlist", path: "/wishlist" },
  ]

  const accountItems = [
    { icon: User, label: "Profile", key: "Profile", path: "/user-profile" },
    { icon: MapPin, label: "Addresses", key: "Addresses", path: "/addresses" },
    { icon: CreditCard, label: "Payments", key: "Payments", path: "/payments" },
  ]

  const otherItems = [{ icon: Bell, label: "Notifications", key: "Notifications", path: "/notifications" }]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const sidebarVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.04,
      },
    },
  }

  const isActive = (path: string) => {
    if (path === "/orders" && (location.pathname === "/" || location.pathname === "/orders")) return true
    return location.pathname === path
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
   logout()
    navigate("/client")
  }

  const SidebarContent = () => (
    <>
      {/* Profile Section */}
      <motion.div className="mb-8" variants={itemVariants}>
        <motion.h2
          className="text-xl font-semibold text-gray-800 mb-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Hala !
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600 mb-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          yousefshwaly@gmail.com
        </motion.p>

        <motion.div
          className="flex items-center gap-3 mb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span className="text-sm text-gray-600">Profile Completion</span>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200">
              20%
            </Badge>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full bg-gray-200 rounded-full h-2"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="bg-purple-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "20%" }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Navigation Items */}
      <motion.div className="space-y-1 mb-8" variants={containerVariants}>
        {sidebarItems.map((item) => (
          <motion.div
            key={item.key}
            variants={itemVariants}
            whileHover={{ x: 6, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={item.path} onClick={handleLinkClick}>
              <Button
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-sm"
                    : "hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                <motion.div whileHover={{ rotate: isActive(item.path) ? 0 : 5 }} transition={{ duration: 0.2 }}>
                  <item.icon className="h-5 w-5" />
                </motion.div>
                {item.label}
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* My Account Section */}
      <motion.div className="mb-8" variants={containerVariants}>
        <motion.h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
          variants={itemVariants}
        >
          MY ACCOUNT
        </motion.h3>
        <div className="space-y-1">
          {accountItems.map((item) => (
            <motion.div
              key={item.key}
              variants={itemVariants}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={item.path} onClick={handleLinkClick}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-sm"
                      : "hover:bg-gray-100 hover:shadow-sm"
                  }`}
                >
                  <motion.div whileHover={{ rotate: isActive(item.path) ? 0 : 5 }} transition={{ duration: 0.2 }}>
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  {item.label}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Others Section */}
      <motion.div className="mb-8" variants={containerVariants}>
        <motion.h3
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
          variants={itemVariants}
        >
          OTHERS
        </motion.h3>
        <div className="space-y-1">
          {otherItems.map((item) => (
            <motion.div
              key={item.key}
              variants={itemVariants}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={item.path} onClick={handleLinkClick}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-sm"
                      : "hover:bg-gray-100 hover:shadow-sm"
                  }`}
                >
                  <motion.div whileHover={{ rotate: isActive(item.path) ? 0 : 5 }} transition={{ duration: 0.2 }}>
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  {item.label}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.div variants={containerVariants} className="mb-8">
        <motion.div
          variants={itemVariants}
          whileHover={{ x: 6, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all duration-200"
            onClick={handleLinkClick}
          >
            <motion.div whileHover={{ rotate: 5 }} transition={{ duration: 0.2 }}>
              <LogOut className="h-5 w-5" />
            </motion.div>
            Sign out
          </Button>
        </motion.div>
      </motion.div>
    </>
  )

  // Mobile Sidebar
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 p-6 lg:hidden overflow-y-auto"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Desktop Sidebar
  return (
    <motion.div
      className="hidden lg:block w-80 bg-white shadow-sm border-r border-gray-200 min-h-screen "
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Profile Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Hala !
          </motion.h2>
          <motion.p
            className="text-sm text-gray-600 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            yousefshwaly@gmail.com
          </motion.p>

          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="text-sm text-gray-600">Profile Completion</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200">
                20%
              </Badge>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full bg-gray-200 rounded-full h-2"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="bg-purple-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "20%" }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Navigation Items */}
        <motion.div className="space-y-1 mb-8" variants={containerVariants}>
          {sidebarItems.map((item) => (
            <motion.div
              key={item.key}
              variants={itemVariants}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={item.path} onClick={handleLinkClick}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-sm"
                      : "hover:bg-gray-100 hover:shadow-sm"
                  }`}
                >
                  <motion.div whileHover={{ rotate: isActive(item.path) ? 0 : 5 }} transition={{ duration: 0.2 }}>
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  {item.label}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* My Account Section */}
        <motion.div className="mb-8" variants={containerVariants}>
          <motion.h3
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            variants={itemVariants}
          >
            MY ACCOUNT
          </motion.h3>
          <div className="space-y-1">
            {accountItems.map((item) => (
              <motion.div
                key={item.key}
                variants={itemVariants}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={item.path} onClick={handleLinkClick}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-sm"
                        : "hover:bg-gray-100 hover:shadow-sm"
                    }`}
                  >
                    <motion.div whileHover={{ rotate: isActive(item.path) ? 0 : 5 }} transition={{ duration: 0.2 }}>
                      <item.icon className="h-5 w-5" />
                    </motion.div>
                    {item.label}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Others Section */}
        <motion.div className="mb-8" variants={containerVariants}>
          <motion.h3
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            variants={itemVariants}
          >
            OTHERS
          </motion.h3>
          <div className="space-y-1">
            {otherItems.map((item) => (
              <motion.div
                key={item.key}
                variants={itemVariants}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={item.path} onClick={handleLinkClick}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-sm"
                        : "hover:bg-gray-100 hover:shadow-sm"
                    }`}
                  >
                    <motion.div whileHover={{ rotate: isActive(item.path) ? 0 : 5 }} transition={{ duration: 0.2 }}>
                      <item.icon className="h-5 w-5" />
                    </motion.div>
                    {item.label}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Spacer to push Sign out to bottom */}
        <div className="flex-1"></div>

        {/* Sign Out - positioned at bottom */}
        <motion.div variants={containerVariants} className="mb-8">
          <motion.div
            variants={itemVariants}
            whileHover={{ x: 6, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all duration-200"
              onClick={handleLinkClick}
            >
              <motion.div whileHover={{ rotate: 5 }} transition={{ duration: 0.2 }}>
                <LogOut className="h-5 w-5" />
              </motion.div>
              Sign out
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
