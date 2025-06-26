import SectionHeader from "./section-header"
import ImageCard from "./image-card"

import {

  Home,
  Palette,
  Wrench,
  Hammer,
  User,
  Settings,
  ShoppingBag,

} from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"



  const services = [
    { icon: Home, label: "Furnish your home", description: "We help you make your dream home",link:'/Ask?type=furnish-house' },
    { icon: Palette, label: "Request design", description: "Get professional design consultation",link:'/Ask?type=request-design' },
    { icon: Wrench, label: "Kitchen remodeling", description: "Transform your kitchen space" ,link:'/Ask?type=kitchen'},
    { icon: Hammer, label: "Renovate Your Home", description: "Complete home renovation services",link:'/Ask?type=home-renovate' },
    { icon: User, label: "Ask to Engineer", description: "Consult with our engineers",link:'/Ask?type=engineer' },
    { icon: Settings, label: "Ask to Technical", description: "Technical support and guidance",link:'/Ask?type=worker' },
  ]


export default function MidSect() {


  const [isVisible, setIsVisible] = useState(false)
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="max-w-[87rem] mx-auto px-4  py-8 ">

            <div
          className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Services</h2>
            <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">See all</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
            {services.map((service, index) => (
              <Link   key={index} to={service?.link}>
              <div
              
                className={`flex flex-col items-center text-center group cursor-pointer transition-all duration-500 hover:scale-105 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                    hoveredService === index ? "bg-blue-100 scale-110" : ""
                  }`}
                >
                  <service.icon
                    className={`w-10 h-10 transition-colors duration-300 ${
                      hoveredService === index ? "text-blue-600" : "text-gray-600"
                    }`}
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.label}
                </h3>
                <p className="text-xs text-gray-500 leading-tight">{service.description}</p>
              </div>
              </Link>
            ))}
          </div>

          {/* Shop now button */}
          <Link to={"/Ask?type=shop"}>
          <div className="flex justify-center">
            <div
              className={`flex flex-col items-center text-center group cursor-pointer transition-all duration-500 hover:scale-105 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "900ms" }}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:bg-blue-100 transition-all duration-300">
                <ShoppingBag className="w-10 h-10 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Shop now
              </h3>
            </div>
          </div>
          </Link>
        </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* More reasons to shop section */}
        <div className="md:col-span-1 flex flex-col h-full  bg-white p-4 ">

          <SectionHeader text="More reasons to shop" />
          <div className="grid grid-cols-2 gap-4 flex-grow">
            <ImageCard imageSrc="/ProductImages/prod4.png" bgColor="bg-green-100" />
            <ImageCard imageSrc="/ProductImages/prod5.png" bgColor="bg-yellow-100" />
            <ImageCard imageSrc="/ProductImages/prod6.png" bgColor="bg-red-50" />
            <ImageCard imageSrc="/ProductImages/prod7.png" bgColor="bg-yellow-100" />
          </div>
        </div>

        {/* Mega deals section */}
        <div className="md:col-span-1 bg-[#FDF6BB] p-4  flex flex-col h-full">
          <SectionHeader text="Mega deals" />
          <div className="grid grid-cols-2 gap-4 flex-grow">
            <ImageCard imageSrc="/ProductImages/prod8.png" badgeText="Fashion deals" badgeColor="bg-yellow-300" />
            <ImageCard imageSrc="/ProductImages/prod9.png" badgeText="Gaming deals" badgeColor="bg-yellow-300" />
            <ImageCard imageSrc="/ProductImages/prod10.png" badgeText="Baby deals" badgeColor="bg-yellow-300" />
            <ImageCard imageSrc="/ProductImages/prod11.png" badgeText="Stationery deals" badgeColor="bg-yellow-300" />
          </div>
        </div>

        {/* In focus section */}
        <div className="md:col-span-1 flex flex-col h-full  bg-white p-4">
          <SectionHeader text="In focus" />
          <div className="flex flex-col gap-4 flex-grow">
            <ImageCard imageSrc="/ProductImages/prod2.jpg" bgColor="bg-blue-50" fullHeight style="w-full "/>
            <ImageCard imageSrc="/ProductImages/prod3.jpg" bgColor="bg-red-50" fullHeight style="w-full " />
          </div>
        </div>
      </div>
    </main>
  )
}
