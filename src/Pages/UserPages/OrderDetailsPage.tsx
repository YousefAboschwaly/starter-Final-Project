"use client"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect, useContext, useCallback } from "react"
import { OrderDetails } from "./components/order-details"
import { Loader2 } from "lucide-react"
import { UserContext } from "@/Contexts/UserContext"

interface Product {
  id: number
  name: string
  mainImagePath: string
}

interface OrderDetail {
  id: number
  statusCode: string | null
  product: Product
  price: number
  amount: number
}

interface OrderData {
  userId: number
  orderNumber: string
  deliveryAddress: string
  orderDetails: OrderDetail[]
  totalPrice: number
  statusCode?: string
  status?: {
    code: string
    name: string
  }
  orderStatus?: string
  orderStatusCode?: string
}

interface ApiResponse {
  success: boolean
  status: number
  data: OrderData
}

// IMPORTANT: Interface for navigation state
interface NavigationState {
  selectedDropdownStatus?: string
  readableStatus?: string
  fromOrdersList?: boolean
}

export default function OrderDetailsPage() {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, pathUrl } = userContext
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // IMPORTANT: Get the navigation state passed from OrdersPage
  const navigationState = location.state as NavigationState | null

  const fetchOrderDetails = useCallback(
    async (orderId: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${pathUrl}/api/v1/orders/${orderId}`, {
          headers: {
            "Accept-language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        if (data.success) {
          setOrderData(data.data)
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    },
    [pathUrl, userToken],
  )

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        await fetchOrderDetails(id)
      }
    }
    fetchOrder()
  }, [id, fetchOrderDetails])

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading order details...</span>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">{error || "The order you're looking for doesn't exist."}</p>
          <button onClick={() => navigate("/orders")} className="text-blue-600 hover:text-blue-800 underline">
            Back to orders
          </button>
        </div>
      </div>
    )
  }

  // IMPORTANT: Enhanced function that prioritizes dropdown selection
  const getOrderStatus = (orderData: OrderData): string => {
    // PRIORITY 1: Use the dropdown selection if available
    if (navigationState?.fromOrdersList && navigationState?.readableStatus) {
      console.log("Using dropdown selection status:", navigationState.readableStatus)
      return navigationState.readableStatus
    }

    // PRIORITY 2: Try to determine from API response
    console.log("Determining order status from API response:", {
      statusCode: orderData.statusCode,
      status: orderData.status,
      orderStatus: orderData.orderStatus,
      orderStatusCode: orderData.orderStatusCode,
    })

    const possibleStatusFields = [
      orderData.statusCode,
      orderData.orderStatusCode,
      orderData.orderStatus,
      orderData.status?.code,
      orderData.status?.name,
    ]

    for (const statusField of possibleStatusFields) {
      if (statusField) {
        const normalizedStatus = statusField.toString().toUpperCase()

        switch (normalizedStatus) {
          case "DELIVERED":
          case "DELIVERY":
          case "COMPLETE":
          case "COMPLETED":
            return "Delivered"
          case "CANCELED":
          case "CANCELLED":
          case "CANCEL":
            return "Cancelled"
          case "PENDING":
          case "PROCESSING":
          case "ACTIVE":
            return "Pending"
        }
      }
    }

    // PRIORITY 3: Fallback to order details status
    if (orderData.orderDetails.length > 0) {
      const statuses = orderData.orderDetails.map((detail) => detail.statusCode).filter(Boolean)

      if (statuses.length > 0 && statuses.every((status) => status === statuses[0])) {
        const normalizedStatus = statuses[0]!.toString().toUpperCase()

        switch (normalizedStatus) {
          case "DELIVERED":
          case "DELIVERY":
          case "COMPLETE":
          case "COMPLETED":
            return "Delivered"
          case "CANCELED":
          case "CANCELLED":
          case "CANCEL":
            return "Cancelled"
          case "PENDING":
          case "PROCESSING":
          case "ACTIVE":
            return "Pending"
        }
      }
    }

    return "Unknown"
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Delivered":
        return "text-green-600"
      case "Cancelled":
        return "text-red-600"
      case "Pending":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  // Transform the API data to match the expected format for OrderDetails component
  const transformedOrder = {
    id: orderData.orderNumber,
    status: getOrderStatus(orderData), // IMPORTANT: This now uses dropdown selection first
    statusColor: getStatusColor(getOrderStatus(orderData)),
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    product: orderData.orderDetails.length > 0 ? orderData.orderDetails[0].product.name : "Product",
    price: orderData.totalPrice,
    quantity: orderData.orderDetails.reduce((total, detail) => total + detail.amount, 0),
    deliveryAddress: orderData.deliveryAddress,
    orderDetails: orderData.orderDetails,
    userId: orderData.userId,
  }

  return <OrderDetails order={transformedOrder} onBack={() => navigate("/orders")} />
}
