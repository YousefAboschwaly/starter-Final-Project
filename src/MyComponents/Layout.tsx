import { Outlet } from "react-router-dom";
import Navbar from './Navbar'
import { useBusinessConfig } from "@/hooks/useBusinessConfig";
import BusinessTypeNavigation from "@/Pages/LandingPage/TopSection/BusinessTypeNavigation";
import { UserContext } from "@/Contexts/UserContext";
import { useContext } from "react";

export default function Layout() {
   const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken} = userContext
    const { businessTypeCategories, isLoading,isError,error,refetch ,businessTypes} = useBusinessConfig();
    console.log("Business Type Categories:", businessTypeCategories);
  return (
    <>
      <div className="sticky inset-0 z-40" >
      {/* Navbar */}
      <Navbar />
    {
      isLoading && userToken && (
        <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded mx-4 my-2">
          <p className="text-sm">Loading categories...</p>
        </div>
      )
    }
 
      {isError &&userToken&& (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-4 my-2">
          <div className="flex items-center justify-between">
            <p className="text-sm">Failed to load categories: {error?.message}</p>
            <button
              onClick={() => refetch()}
              className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && businessTypeCategories.length > 0 && userToken&& (
        <BusinessTypeNavigation businessTypeCategories={businessTypeCategories} businessTypes={businessTypes} />
      )}

      {!isLoading && !isError && businessTypeCategories.length === 0 &&  userToken&&  (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mx-4 my-2">
          <p className="text-sm">No categories available at the moment.</p>
        </div>
      )}

      </div>
    <div className="  ">
      
      <Outlet/>

    </div>
    </>
  )
}
