"use client"

import { useContext, useEffect, useState } from "react"
import { ChevronDown, List, Menu, Heart, User } from "lucide-react"
import vector from "/Vector.png"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../Contexts/UserContext"
import axios from "axios"
import Logo from "/Logo.png"
import { SimpleCartIcon } from "@/Pages/Cart/CartIcon"

export default function Navbar() {
  const navigate = useNavigate()

  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, setShowAddProject, logout } = userContext

  const userType = localStorage.getItem("user-type")
  const isEngineerOrTechnical = userType === "engineer" || userType === "technical worker"
  const isStoreOrExhibition = userType === "store" || userType === "exhibition"

  function handleLogout() {
    logout()
    navigate("/client")
  }

  // If user is not authenticated, show login/signup navbar
  if (!userToken) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#2D2D4C] md:text-2xl group">
            <img src={Logo || "/placeholder.svg"} alt="Logo" className="h-14 w-30" />
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Login/Signup */}
            <div className="hidden md:flex items-center gap-4">
              <JoinUsButton />
              <LoginButton />
            </div>

            {/* Mobile Login/Signup */}
            <div className="flex md:hidden items-center gap-2">
              <JoinUsButton />
              <LoginButton />
            </div>

          
          </div>
        </div>
      </header>
    )
  }

  // Unified authenticated navbar for all user types
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#2D2D4C] md:text-2xl group">
          <img src={Logo || "/placeholder.svg"} alt="Logo" className="h-14 w-30" />
        </Link>

        <div className="flex items-center gap-4">
          
          {/* Action Buttons for Different User Types */}
          {isEngineerOrTechnical && (
            <div className="hidden md:flex items-center gap-2">
              <Button
                className="text-[#2D2D4C] border-none font-bold bg-white primary-grad hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6] hover:opacity-90 transition-opacity duration-700 ease-in-out"
                onClick={() => setShowAddProject(true)}
              >
                Add Project
              </Button>
            </div>
          )}


          {isStoreOrExhibition && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/productlist">
                <Button className="text-[#2D2D4C] border-none ring-0 font-bold bg-white primary-grad hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6] hover:opacity-90 transition-opacity duration-700 ease-in-out rounded-xl">
                  <List className="w-5 h-5" />
                  Product List
                </Button>
              </Link>
              <Link to="/addproduct">
                <Button className="text-[#2D2D4C] border border-[#2D2D4C] font-bold bg-white hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6] hover:opacity-90 transition-opacity duration-700 ease-in-out rounded-xl">
                  <img src={vector || "/placeholder.svg"} alt="Add Product" className="w-5 h-5" />
                  Add Product
                </Button>
              </Link>
            </div>
          )}

          {/* Language Toggle */}
          <button className="text-base font-normal leading-[23.52px] transition-colors hover:text-primary">
            العربية
          </button>

          {/* Common Features for All Users */}
          {/* Wishlist */}
          <Link to="/wishlist" className="text-base font-normal leading-[23.52px] transition-colors hover:text-primary">
            <Heart className="h-6 w-6" />
          </Link>

          {/* Cart */}
          <SimpleCartIcon size="lg" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User id="user-icon" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Common Menu Items for All Users */}
              <DropdownMenuItem className="p-0">
                <Link to="/orders" className="flex w-full items-center gap-2 p-2">
                  <span>📦</span>
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link to="/addresses" className="flex w-full items-center gap-2 p-2">
                  <span>📍</span>
                  Addresses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link to="/payments" className="flex w-full items-center gap-2 p-2">
                  <span>💳</span>
                  Payments
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link to="/credits" className="flex w-full items-center gap-2 p-2">
                  <span>💰</span>
                  Credits
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link to="/returns" className="flex w-full items-center gap-2 p-2">
                  <span>↩️</span>
                  Returns
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link to="/warranty" className="flex w-full items-center gap-2 p-2">
                  <span>🛡️</span>
                  Warranty Claims
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link to="/profile" className="flex w-full items-center gap-2 p-2">
                  <span>👤</span>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link to="/help" className="flex w-full items-center gap-2 p-2">
                  <span>❓</span>
                  Need Help?
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <button onClick={handleLogout} className="flex w-full items-center gap-2 p-2 text-left">
                  <span>🚪</span>
                  Sign Out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-4 mt-8">


             
                {/* Action Buttons for Mobile */}
                {isEngineerOrTechnical && (
                  <Button
                    className="w-full text-[#2D2D4C] border border-[#2D2D4C] font-bold bg-white primary-grad hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6] hover:opacity-90 transition-opacity duration-700 ease-in-out"
                    onClick={() => setShowAddProject(true)}
                  >
                    Add Project
                  </Button>
                )}

                {isStoreOrExhibition && (
                  <div className="flex flex-col gap-2">
                    <Link to="/productlist">
                      <Button className="w-full text-[#2D2D4C] font-bold bg-white primary-grad hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6] hover:opacity-90 transition-opacity duration-700 ease-in-out rounded-xl">
                        <List className="w-5 h-5 mr-2" />
                        Product List
                      </Button>
                    </Link>
                    <Link to="/addproduct">
                      <Button className="w-full text-[#2D2D4C] border border-[#2D2D4C] font-bold bg-white hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6] hover:opacity-90 transition-opacity duration-700 ease-in-out rounded-xl">
                        <img src={vector || "/placeholder.svg"} alt="Add Product" className="w-5 h-5 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                  </div>
                )}

              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function LoginButton() {
  return (
    <Link
      to={"/client"}
      className="primary-grad rounded-[8px] px-10 py-2 btn text-base font-bold leading-6 text-center"
    >
      Login
    </Link>
  )
}

interface IUserTypes {
  id: number
  code: string
  name: string
}

function JoinUsButton() {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl } = userContext

  const [isOpen, setIsOpen] = useState(false)
  const [userTypes, setUserTypes] = useState<IUserTypes[]>([])

  useEffect(() => {
    async function getUserTypes() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/user-types`, {
          headers: { "Accept-Language": "en" },
        })
        setUserTypes(data.data)
      } catch (error) {
        console.error("Error fetching User Types:", error)
      }
    }
    getUserTypes()
  }, [pathUrl])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent rounded-[8px] px-4 py-2 btn text-base font-bold leading-6 text-center text-[#2D2D4C] hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6]">
          Join Us
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px] animate-in slide-in-from-top-2 duration-200">
        {userTypes.map((userType) => (
          <Link to={`/Join-as/${userType.name}`} key={userType.id}>
            <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-secondary">
              {userType.name}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
