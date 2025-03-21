"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Home, Package, Settings, Star, Tag, HelpCircle, UserRoundCog } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  totalProducts: number
}


const Sidebar: React.FC<SidebarProps> = ({ isOpen,totalProducts }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "#" },
    { icon: Package, label: "Products", href: "/productlist", badge: totalProducts },
    { icon: Tag, label: "Offers", href: "#", badge: "New" },
    { icon: Star, label: "Reviews", href: "/reviews" },
    { icon: UserRoundCog, label: "Overview", href: "/overview" },
    { icon: Settings, label: "Settings", href: "#" },
    { icon: HelpCircle, label: "Help Center", href: "#" },
  ]
  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? 280 : 80,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="fixed left-0 top-0 h-screen bg-[#1a1b2e] text-white shadow-xl z-50 flex flex-col"
    >
      <div className={`p-6 ${isOpen ? "px-6" : "px-4"}`}>
        <div className="flex items-center justify-between mb-8">
          {isOpen ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Home className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-semibold">ArciSpace</span>
            </motion.div>
          ) : (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center w-full"
            >
              <Home className="w-6 h-6 text-purple-400" />
            </motion.div>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors relative group ${
                index === 1 ? "bg-white/10" : ""
              }`}
              whileHover={{ x: isOpen ? 10 : 0 }}
            >
              <item.icon className={`w-5 h-5 ${index === 1 ? "text-purple-400" : ""}`} />
              {isOpen && (
                <motion.span initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                  {item.label}
                </motion.span>
              )}
              {isOpen && item.badge && (
                <motion.span
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.badge === "New" ? "bg-purple-500 text-white" : "bg-white/20"
                  }`}
                >
                  {item.badge}
                </motion.span>
              )}
              {!isOpen && item.badge && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[10px] ${
                    item.badge === "New" ? "bg-purple-500 text-white" : "bg-white/20"
                  }`}
                >
                  {item.badge === "New" ? "N" : item.badge}
                </motion.div>
              )}
              {!isOpen && (
                <motion.div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && ` (${item.badge})`}
                </motion.div>
              )}
            </motion.a>
          ))}
        </nav>
      </div>

      {isOpen ? (
        <div className="mt-auto p-6">
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-purple-500/20 rounded-lg p-4"
          >
            <h4 className="text-purple-400 font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-gray-300 mb-3">Contact our support team for assistance</p>
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 text-sm transition-colors">
              Contact Support
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="mt-auto p-4">
          <motion.button
            initial={false}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            className="w-full aspect-square rounded-lg bg-purple-500/20 flex items-center justify-center group"
          >
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <motion.div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
              Need Help?
            </motion.div>
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

export default Sidebar

