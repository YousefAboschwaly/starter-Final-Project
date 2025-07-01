"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronRight, HelpCircle, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "@/Contexts/UserContext"

interface OrderStatus {
  id: number
  code: string
  name: string
}

interface Order {
  id: number
  orderNumber: string
  quantity: number
  price: number
  status: OrderStatus
  createdDate: string
}

interface ApiResponse {
  success: boolean
  status: number
  data: Order[]
}

export default function OrdersPage() {
    const userContext = useContext(UserContext)
    if (!userContext) {
      throw new Error("UserContext must be used within a UserContextProvider")
    }
    const { userToken, pathUrl,userId } = userContext
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedStatus, setSelectedStatus] = useState("DELIVERED")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  // Fetch orders function wrapped in useCallback to avoid recreating on every render
  const fetchOrders = useCallback(
    async (statusCode: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${pathUrl}/api/v1/orders/user/${localStorage.getItem(
            "user-id"
          )}?statusCode=${statusCode}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Accept-Language": "en",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()
        console.log(data);
        if (data.success) {
          setOrders(data.data)
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders")
        setOrders([])
      } finally {
        setLoading(false)
      }
    },
    [pathUrl, userToken]
  )

  // Fetch orders when status changes
  useEffect(() => {
    fetchOrders(selectedStatus)
  }, [fetchOrders, pathUrl, selectedStatus, userId, userToken])

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

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

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -4,
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`)
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case "DELIVERED":
        return "text-green-600"
      case "CANCELED":
        return "text-orange-500"
      case "PENDING":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Desktop Header */}
        <motion.div
          className="hidden lg:block mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Orders
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            View the delivery status for items and your order history
          </motion.p>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <motion.h2
              className="text-xl font-semibold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Orders ({selectedStatus.toLowerCase()})
            </motion.h2>
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div className="relative" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Find orders by number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 transition-all duration-200 focus:ring-2 focus:ring-yellow-400"
                />
              </motion.div>
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELED">Cancelled</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Loading State */}
          {loading && (
            <motion.div
              className="flex items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div className="text-center py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-red-500 mb-2">Error loading orders</div>
              <div className="text-sm text-gray-400 mb-4">{error}</div>
              <Button onClick={() => fetchOrders(selectedStatus)} variant="outline">
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Orders List */}
          {!loading && !error && (
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {filteredOrders.map((order, index) => (
                <motion.div key={order.id} variants={itemVariants} whileHover="hover" custom={index}>
                  <motion.div
                    variants={cardHoverVariants}
                    className="cursor-pointer"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <Card className="transition-all duration-300 border-gray-200 hover:border-gray-300">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          {/* <motion.div
                            whileHover={{
                              scale: 1.1,
                              rotate: 5,
                              transition: { duration: 0.3 },
                            }}
                            className="flex-shrink-0"
                          >
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Headphones className="h-8 w-8 lg:h-10 lg:w-10 text-gray-400" />
                            </div>
                          </motion.div> */}

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <motion.span
                                className={`font-semibold ${getStatusColor(order.status.code)}`}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.7, duration: 0.4 }}
                              >
                                {order.status.code}
                              </motion.span>
                              <motion.span
                                className="text-gray-600 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.8, duration: 0.4 }}
                              >
                                on {formatDate(order.createdDate)}
                              </motion.span>
                            </div>

                            <motion.div
                              className="mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.9, duration: 0.4 }}
                            >
                              <p className="text-black text-md lg:text-base font-medium mb-3">
                               <span className="text-[#777E90]"> Order Number : </span>{order.orderNumber}
                              </p>

                              {/* Quantity and Subtotal in side-by-side layout */}
                              <div className="flex items-center justify-between text-md text-[#777E90]">
                                <span >Quantity: <span className="text-black">{order.quantity}</span> </span> 
                                <span>Subtotal: <span className="text-black"> EGP {order.price.toFixed(2)}</span></span>
                              </div>
                            </motion.div>

                            <motion.p
                              className="text-xs text-gray-500"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 1.0, duration: 0.4 }}
                            >
                              Order ID: {order.id}
                            </motion.p>
                          </div>

                          {/* Arrow */}
                          <motion.div
                            whileHover={{
                              x: 8,
                              transition: { duration: 0.2 },
                            }}
                            className="flex-shrink-0"
                          >
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Results */}
          {!loading && !error && filteredOrders.length === 0 && orders.length > 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-gray-500 mb-2">No orders found</div>
              <div className="text-sm text-gray-400">Try adjusting your search criteria</div>
            </motion.div>
          )}

          {/* No Orders */}
          {!loading && !error && orders.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-gray-500 mb-2">No {selectedStatus.toLowerCase()} orders</div>
              <div className="text-sm text-gray-400">Try selecting a different status</div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Help Button */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          delay: 1.5,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full h-12 px-4 lg:px-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <motion.div animate={{ rotate: 0 }} whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
            <HelpCircle className="h-5 w-5 mr-2" />
          </motion.div>
          <span className="hidden sm:inline">Need Help?</span>
          <span className="sm:hidden">Help</span>
        </Button>
      </motion.div>
    </div>
  )
}
