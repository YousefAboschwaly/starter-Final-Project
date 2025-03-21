import { useContext } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { IBusinessType, IData } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useProductData() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { userToken, pathUrl } = userContext;

  // Function to fetch data
   function getData() {
   return axios.get(`${pathUrl}/api/v1/business-config`, {
      headers: {
        "Accept-Language": "en",
        Authorization: `Bearer ${userToken}`,
      },
    });
  }

  const { data, isLoading, error } = useQuery<{data:{ data: IData }}, Error,IData>({
    queryKey:[ "business-config"],
    queryFn: getData,
    select:(data)=>data.data.data
  })
  function getBusinessTypes(){
    return axios.get(`${pathUrl}/api/v1/business-types/user-type/${localStorage.getItem('user-type')==='store'?5:3}`, {
      headers: {
        "Accept-Language": "en",
        "content-language": "en",
        Authorization: `Bearer ${userToken}`,
      },
    })
  }
  const{data:businessTypes}= useQuery<{data:{data:IBusinessType[]}},Error,IBusinessType[]>({
    queryKey:[ "business-types"],
    queryFn: getBusinessTypes,
    select:(data)=>data.data.data
  })

  console.log(businessTypes)
  

  // Helper function to get material display name with Arabic
  const getMaterialDisplayName = (code: string): string => {
    const material = data?.productMaterial.find((m) => m.code === code);
    if (!material) return code;
    return `${material.name}`;
  };

  // Helper function to get material style
  const getMaterialStyle = (code: string): { bgColor: string; textColor: string } => {
    switch (code) {
      case "WOOD":
        return { bgColor: "bg-amber-50", textColor: "text-amber-800" };
      case "METAL":
      case "STEEL":
      case "ALUMINUM":
        return { bgColor: "bg-gray-100", textColor: "text-gray-700" };
      case "PLASTIC":
      case "PVC":
        return { bgColor: "bg-blue-50", textColor: "text-blue-700" };
      case "FABRIC":
      case "LEATHER":
        return { bgColor: "bg-purple-50", textColor: "text-purple-700" };
      case "GLASS":
        return { bgColor: "bg-cyan-50", textColor: "text-cyan-700" };
      case "MARBLE":
      case "GRANITE":
      case "STONE":
        return { bgColor: "bg-stone-50", textColor: "text-stone-700" };
      case "COPPER":
      case "GOLD":
        return { bgColor: "bg-amber-100", textColor: "text-amber-900" };
      case "RUBBER":
        return { bgColor: "bg-slate-100", textColor: "text-slate-700" };
      case "FOAM":
        return { bgColor: "bg-yellow-50", textColor: "text-yellow-800" };
      case "CARBON_FIBER":
        return { bgColor: "bg-zinc-100", textColor: "text-zinc-800" };
      case "CONCRETE":
        return { bgColor: "bg-neutral-100", textColor: "text-neutral-700" };
      case "BAMBOO":
        return { bgColor: "bg-lime-50", textColor: "text-lime-800" };
      case "CERAMIC":
        return { bgColor: "bg-orange-50", textColor: "text-orange-800" };
      default:
        return { bgColor: "bg-gray-50", textColor: "text-gray-700" };
    }
  };

  return { data, isLoading, error, getMaterialDisplayName, getMaterialStyle , businessTypes };
}
