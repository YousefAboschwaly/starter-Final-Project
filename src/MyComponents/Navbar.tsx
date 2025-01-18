"use client"

import { useContext, useEffect, useState } from 'react'
import { Home, ChevronDown, Menu, Heart, ShoppingCart } from 'lucide-react'
import user from '../../public/user.webp'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Link } from 'react-router-dom';
import { UserContext } from '@/Contexts/UserContext'
import axios from 'axios'


export default function Navbar() {

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { userToken,setUserToken } = userContext;

  function logout(){
    setUserToken('')
    localStorage.removeItem('userToken')
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 `}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-[#2D2D4C] md:text-2xl group"
        >
          <Home className="h-6 w-6 transition-transform duration-300 group-hover:rotate-[360deg]" />
          <span className="transition-colors duration-300 group-hover:text-primary">Home4U</span>
        </Link>

        {userToken && <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-base font-normal  leading-[23.52px] transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-base font-normal  leading-[23.52px] transition-colors hover:text-primary"
          >
            Products
          </Link>
          <Link
            to="/categories"
            className="text-base font-normal  leading-[23.52px] transition-colors hover:text-primary"
          >
            Categories
          </Link>
          <Link
            to="/brands"
            className="text-base font-normal  leading-[23.52px] transition-colors hover:text-primary"
          >
            Brands
          </Link>
        </nav>}



        <div className={`flex items-center ml-auto  ${userToken&&' md:ml-0'}  gap-4 `}>

        <div className="flex items-center gap-4">
          {!userToken && <div className="hidden md:flex items-center gap-4">
            <JoinUsButton />
            <LoginButton />
          </div>
}
          {!userToken && <div className="flex md:hidden items-center justify-center flex-grow gap-2 w-full max-w-[300px]">
            <JoinUsButton />
            <LoginButton />
          </div>}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
             {userToken &&  <nav className="grid gap-4">
                <Link to="/" className="text-lg font-semibold">
                  Home
                </Link>
                <Link to="/products" className="text-lg font-semibold">
                  Products
                </Link>
                <Link to="/categories" className="text-lg font-semibold">
                  Categories
                </Link>
                <Link to="/brands" className="text-lg font-semibold">
                  Brands
                </Link>
              </nav>}
            </SheetContent>
          </Sheet>
        </div>

            {userToken &&<div className="hidden md:flex items-center gap-4">
            <Link to="/wishlist" className="text-muted-foreground hover:text-primary">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-600 text-[10px] font-bold text-white flex items-center justify-center">
                7
              </span>
            </Link>
          </div>}

        {   userToken &&       <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  alt="Avatar"
                  className="rounded-full w-8 h-8"
                  height="32"
                  src={user}
                  style={{
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem  className=" p-0">
                <Link to="/client" className="flex w-full p-1" onClick={logout}>
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
      
      </div>
    </header>
  )
}

function LoginButton() {
  return (
    <Link to={'/client'} 
      className="primary-grad  rounded-[8px] px-10  py-2 btn text-base font-bold leading-6 text-center"
    >
      Login
    </Link>
  )
}

interface IUserTypes{
  
    "id": number;
    "code": string;
    "name": string;

}

function JoinUsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [userTypes, setUserTypes] = useState<IUserTypes[]>([])


// get All user types

useEffect(() => {
  async function getUserTypes() {
    try {
      const { data } = await axios.get(
        "https://dynamic-mouse-needlessly.ngrok-free.app/api/v1/user-types",
        {
          headers: { 'Accept-Language': 'en' }
        }
      );
      setUserTypes(data.data);
      console.log("user Types:", data.data);
    } catch (error) {
      console.error("Error fetching User Types:", error);
    }
  }
  getUserTypes();
}, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
       
       <Button 
       
          className=" bg-transparent rounded-[8px]  px-4 py-2 btn text-base font-bold leading-6 text-center text-[#2D2D4C] hover:bg-gradient-to-r from-[#B8BCC5] to-[#F0ECE6] "
        >
          Join Us
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
       
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px] animate-in slide-in-from-top-2 duration-200">
        {userTypes.map((userType)=>
              <Link to={`/Join-as/${userType.name}`} key={userType.id} >
              <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-secondary">{userType.name}</DropdownMenuItem>

              </Link>)}
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}