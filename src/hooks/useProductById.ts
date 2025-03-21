import { UserContext } from "@/Contexts/UserContext"
import { IProductById } from "@/interfaces"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext } from "react"

export default function useProductById(productId:number) {

    const userContext = useContext(UserContext)
    if (!userContext) {
      throw new Error("UserContext must be used within a UserContextProvider")
    }
    const { pathUrl ,userToken} = userContext

      function getProduct() {
        return axios.get(`${pathUrl}/api/v1/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
            "Accept-Language": "en",
          },
        })
      }
    
      const {
        data: response,
        isLoading,
        error,isError
      } = useQuery({
        queryKey: ["getProductById", productId],
        queryFn: getProduct,
      })
  const product = response?.data?.data as IProductById | undefined

  return { product, isLoading, error , isError };
}
