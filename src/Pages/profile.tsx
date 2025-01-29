import { Sidebar } from "../MyComponents/sidebar"
import { PortfolioGrid } from "../MyComponents/portfolio-grid"
import ProfileCover from '/Rectangle.png'
// import { useContext } from "react"
// import { UserDataContext } from "@/Contexts/UserDataContext"
export default function Profile() {
// let  {workerData,engineerData} = useContext(UserDataContext)
// const whoLogedin = workerData? workerData:engineerData
// const Api =  workerData? 'Api of techinechal worker':"Api of engineer"
// fetch(Api,)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className=" h-[200px] w-full md:h-[300px] bg-slate-600">
        <img
          src={ProfileCover}
          alt="Modern living room with white sofa"
          
          className="object-cover h-full w-full  "
        />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <Sidebar />
          <main className="flex-1">
            <PortfolioGrid />
          </main>
        </div>
      </div>
    </div>
  )
}

