"use client"

import { useState } from 'react'
import { Home, ChevronDown, Menu } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Link } from 'react-router-dom';


export default function Navbar() {


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

        <nav className="hidden md:flex items-center space-x-6">
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
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <LoginButton />
            <JoinUsButton />
          </div>

          <div className="flex md:hidden items-center justify-center flex-grow gap-2 w-full max-w-[300px]">
            <LoginButton />
            <JoinUsButton />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-4">
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
    <Link to={'/client'} 
      className="primary-grad  rounded-[8px] px-4 py-2 btn text-base font-bold leading-6 text-center"
    >
      Login
    </Link>
  )
}

function JoinUsButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
       
       <Button 
          className="secondary-grad  rounded-[8px] px-4 py-2 btn text-base font-bold leading-6 text-center"
        >
          Join Us
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
       
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px] animate-in slide-in-from-top-2 duration-200">
      <Link to='/engineer' >
      <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-secondary">Engineer</DropdownMenuItem>
      </Link>
      <Link to='/company' >
      <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-secondary">Company</DropdownMenuItem>
      </Link>
      <Link to='/consultative' >
      <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-secondary">Consultative</DropdownMenuItem>
      </Link>
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}