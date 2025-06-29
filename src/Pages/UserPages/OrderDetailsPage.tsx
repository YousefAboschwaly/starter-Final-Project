"use client"

import { useParams, useNavigate } from "react-router-dom"
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
}

interface ApiResponse {
  success: boolean
  status: number
  data: OrderData
}

export default function OrderDetailsPage() {
      const userContext = useContext(UserContext)
      if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider")
      }
      const { userToken, pathUrl } = userContext
  const { id } = useParams()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${pathUrl}/api/v1/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-language":"en"
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      console.log("Order Details", data);
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
  }, [pathUrl, userToken])

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id)
    }
  }, [fetchOrderDetails, id])

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

  // Transform the API data to match the expected format for OrderDetails component
  const transformedOrder = {
    id: orderData.orderNumber,
    status: "Delivered", // You might want to get this from the order status or orderDetails
    statusColor: "text-green-600", // Adjust based on actual status
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }), // You might want to add createdDate to the API response
    product: orderData.orderDetails.length > 0 ? orderData.orderDetails[0].product.name : "Product",
    price: orderData.totalPrice,
    quantity: orderData.orderDetails.reduce((total, detail) => total + detail.amount, 0),
    deliveryAddress: orderData.deliveryAddress,
    orderDetails: orderData.orderDetails,
    userId: orderData.userId,
  }

  return <OrderDetails order={transformedOrder} onBack={() => navigate("/orders")}  />
}
