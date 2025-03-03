import { Star, Eye } from "lucide-react"

import { useContext } from "react"
import { UserContext } from "@/Contexts/UserContext"
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface IProject {
  id: number;
  name:string;
  description:string;
  startDate: string,
  endDate: string,
  tools: string,
  coverPath: string
}
export function PortfolioGrid() {
 const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { pathUrl,userToken} = userContext;

    function getProjects(){
      return axios.get(
        `${pathUrl}/api/v1/project/user-projects`,
        {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
    })
  }

const {data:projects,isLoading,isError,error}= useQuery<{data:{data:IProject[]}},Error,IProject[]>({
  queryKey:['projects'],
  queryFn:getProjects,
  select:(data)=>data.data.data
})
if(isLoading){
  return
}
if(isError){
  console.log("error Message",error)
}
    console.log('projects',projects)

  return (
    <div className="grid grid-cols-1  gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects?.map((item: IProject) => (
    <Link to={`/project/${item.id}`} key={item.id}>
          <div  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer">
          <img
            src={item.coverPath ? `${pathUrl}/${item.coverPath}` : "/placeholder.svg"}
            alt={`Portfolio item ${item.id}`}
            className="object-cover transition-transform duration-700 w-full h-full  ease-out group-hover:scale-125"
          />
          {/* Stats container - bottom right corner */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1 rounded-lg bg-white/90 px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">9K</span>
            </div>
            <div className="flex items-center space-x-1 rounded-lg bg-white/90 px-3 py-1">
              <Eye className="h-4 w-4 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">9K</span>
            </div>
          </div>
        </div>
    </Link>
      ))}
    </div>
  )
}

