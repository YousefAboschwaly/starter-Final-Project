"use client"

import type React from "react"

import {
  Heart,
  Star,
  Home,
  Palette,
  Wrench,
  Hammer,
  User,
  Settings,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import LoginAlert from "./loginAlert"


  const services = [
    { icon: Home, label: "Furnish your home", description: "We help you make your dream home",link:'/Ask?type=furnish' },
    { icon: Palette, label: "Request design", description: "Get professional design consultation",link:'/Ask?type=design' },
    { icon: Wrench, label: "Kitchen remodeling", description: "Transform your kitchen space" ,link:'/Ask?type=kitchen'},
    { icon: Hammer, label: "Renovate Your Home", description: "Complete home renovation services",link:'/Ask?type=renovate' },
    { icon: User, label: "Ask to Engineer", description: "Consult with our engineers",link:'/Ask?type=engineer' },
    { icon: Settings, label: "Ask to Technical", description: "Technical support and guidance",link:'/Ask?type=worker' },
  ]

  const offers = [
    {
      title: "Get Special Offer up to 20%",
      subtitle: "Special Offers",
      image: "/ProductImages/prod4.png",
      gradient: "from-orange-400 via-pink-500 to-red-500",
    },
    {
      title: "Summer Sale up to 30%",
      subtitle: "Limited Time",
      image: "/ProductImages/prod2.jpg",
      gradient: "from-blue-400 via-purple-500 to-pink-500",
    },
    {
      title: "New Customer Discount 25%",
      subtitle: "Welcome Offer",
      image:"/ProductImages/prod3.jpg",
      gradient: "from-green-400 via-blue-500 to-purple-500",
    },
  ]

  const spaces = [
    {
      title: "Vision Expo",
      rating: 4.5,
      image: "/ProductImages/prod2.jpg",
      location: "Downtown",
      price: "$2,500/month",
    },
    {
      title: "Vision 1",
      rating: 4.8,
      image: "/ProductImages/prod3.jpg",
      location: "Business District",
      price: "$3,200/month",
    },
    {
      title: "Modern Office",
      rating: 4.6,
      image: "/ProductImages/prod4.png",
      location: "Tech Hub",
      price: "$2,800/month",
    },
    {
      title: "Creative Space",
      rating: 4.7,
      image: "/ProductImages/prod5.png",
      location: "Arts Quarter",
      price: "$3,000/month",
    },
    {
      title: "Executive Suite",
      rating: 4.9,
      image: "/ProductImages/prod6.png",
      location: "City Center",
      price: "$4,500/month",
    },
    {
      title: "Startup Hub",
      rating: 4.4,
      image: "/ProductImages/prod7.png",
      location: "Innovation District",
      price: "$2,200/month",
    },
  ]

export default function ClientHome() {
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  useEffect(()=>{
      if(localStorage.getItem('isLoggedIn')){
        setAlert({ message: "Login Successful. Welcome back to Home4U!", type: 'success' });
        setTimeout(() =>  {setAlert(null);localStorage.removeItem('isLoggedIn')} ,3000); 
  
      }
    
  },[])

  const [isVisible, setIsVisible] = useState(false)
  const [hoveredService, setHoveredService] = useState<number | null>(null)
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)

  const officesScrollRef = useRef<HTMLDivElement>(null)
  const showroomsScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])


  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 300
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const nextOffer = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % offers.length)
  }

  const prevOffer = () => {
    setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Today's Offers Section - Carousel */}
        <div
          className={`mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Today's Offers</h2>
            <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">See all</button>
          </div>

          <div className="relative">
            <Card
              className={`bg-gradient-to-r ${offers[currentOfferIndex].gradient} border-0 relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500`}
            >
              <CardContent className="p-12">
                <div className="flex justify-between items-center">
                  <div className="flex-1 text-white">
                    <p className="text-lg opacity-90 mb-3">{offers[currentOfferIndex].subtitle}</p>
                    <h3 className="text-4xl font-bold mb-8 leading-tight">{offers[currentOfferIndex].title}</h3>
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Order
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl hover:scale-110 transition-transform duration-300">
                      <img
                        src={offers[currentOfferIndex].image || "/placeholder.svg"}
                        alt="Special offer"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Carousel Navigation */}
              <button
                onClick={prevOffer}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextOffer}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </Card>

            {/* Pagination dots */}
            <div className="flex justify-center mt-6 space-x-3">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentOfferIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentOfferIndex ? "bg-blue-600 w-8" : "bg-gray-300 w-3 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Services Section */}
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

        {/* The best offices Section - Carousel */}
        <div
          className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">The best offices</h2>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">See all</button>
              <div className="flex space-x-2">
                <button
                  onClick={() => scroll(officesScrollRef, "left")}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scroll(officesScrollRef, "right")}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={officesScrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {spaces.map((space, index) => (
              <Card
                key={index}
                className={`flex-shrink-0 w-72 group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={space.image || "/placeholder.svg"}
                    alt={space.title}
                    width={280}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                    <Heart className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {space.title}
                    </h3>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full group-hover:bg-yellow-100 transition-colors">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-yellow-700 ml-1">{space.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{space.location}</p>
                  <p className="text-blue-600 font-bold text-lg">{space.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* The best showrooms Section - Carousel */}
        <div
          className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">The best showrooms</h2>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">See all</button>
              <div className="flex space-x-2">
                <button
                  onClick={() => scroll(showroomsScrollRef, "left")}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scroll(showroomsScrollRef, "right")}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={showroomsScrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {spaces.map((space, index) => (
              <Card
                key={index}
                className={`flex-shrink-0 w-72 group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                }`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={space.image || "/placeholder.svg"}
                    alt={space.title}
                    width={280}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                    <Heart className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {space.title}
                    </h3>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full group-hover:bg-yellow-100 transition-colors">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-yellow-700 ml-1">{space.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{space.location}</p>
                  <p className="text-blue-600 font-bold text-lg">{space.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

        <AnimatePresence>
        {alert && (
          <LoginAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}







