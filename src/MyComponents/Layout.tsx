import { Outlet } from "react-router-dom";
import Navbar from './Navbar'
import { useBusinessConfig } from "@/hooks/useBusinessConfig";
import BusinessTypeNavigation from "@/Pages/LandingPage/TopSection/BusinessTypeNavigation";

export default function Layout() {
    const { businessTypeCategories, isLoading,isError,error,refetch ,businessTypes} = useBusinessConfig();
    console.log("Business Type Categories:", businessTypeCategories);
  return (
    <>
      <div className="sticky inset-0 z-[9999999]" >
      {/* Navbar */}
      <Navbar />

      {/* Category Navigation */}
      {isLoading && (
        <div className="relative py-6 bg-white">
          <div className="px-2">
            <div className="flex justify-center gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col items-center animate-pulse">
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-gray-200 rounded-full mb-2"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isError && (
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

      {!isLoading && !isError && businessTypeCategories.length > 0 && (
        <BusinessTypeNavigation businessTypeCategories={businessTypeCategories} businessTypes={businessTypes} />
      )}

      {!isLoading && !isError && businessTypeCategories.length === 0 && (
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
