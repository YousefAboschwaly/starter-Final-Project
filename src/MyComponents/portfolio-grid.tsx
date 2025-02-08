import { Star, Eye } from "lucide-react"
// import pic1 from '/pic1.jpg'
// import pic2 from '/pic2.jpg'
// import pic3 from '/pic3.jpg'
// import pic4 from '/pic4.jpg'
// import pic5 from '/pic5.jpg'
// import pic6 from '/pic6.jpg'
// import pic7 from '/pic7.jpg'
// import pic8 from '/pic8.jpg'
// import pic9 from '/pic9.jpg'
import { useContext, useEffect, useState } from "react"
import { UserContext } from "@/Contexts/UserContext"
import axios from "axios"

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

  // const images =[pic1,pic2,pic3,pic4,pic5,pic6,pic7,pic8,pic9]
  // const items = images
  //   .map((pic, i) => ({
  //     id: i,
  //     image: pic,
  //     views: "9k",
  //     likes: "9k",
  //   }))

    const [projects, setProjects] = useState<IProject[]>([])

    useEffect(()=>{
      const controller = new AbortController()
      const signal = controller.signal
      async function getData(){
        try {
          const { data } = await axios.get(
            `${pathUrl}/api/v1/project/user-projects`,
            {
              headers: {
                "Accept-Language": "en",
                Authorization: `Bearer ${userToken}`,
              },
              signal,
            },
          )
          setProjects(data.data)
        } catch (error: any) {
          console.log(error)
        }
       
      }
      getData()
      return () => {
        controller.abort()
      }
    },[])

    console.log('projects',projects)

  return (
    <div className="grid grid-cols-1  gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects?.map((item) => (
        <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer">
          <img
            src={`${pathUrl}/api/v1/file/download?fileName=${item.coverPath}` || "/placeholder.svg"}
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
      ))}
    </div>
  )
}

