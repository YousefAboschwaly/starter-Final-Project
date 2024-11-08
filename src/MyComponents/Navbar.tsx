import {
  ShoppingCart,
  Heart,
  Menu,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  LogIn,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

const AnimatedButton = motion.create(Button);

export default function Component() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
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

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-green-600 md:text-2xl"
          >
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            Home4U
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Products
          </Link>
          <Link
            to="/categories"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Categories
          </Link>
          <Link
            to="/brands"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Brands
          </Link>
        </nav>

        <div className="flex items-center ml-auto gap-4">
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://instagram.com"
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com"
              className="text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="text-muted-foreground hover:text-primary">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-600 text-[10px] font-bold text-white flex items-center justify-center">
                7
              </span>
            </Link>
          </div>

          {/* Animated Login Buttons with Icons */}
          <div className="hidden md:flex items-center gap-2">
            <AnimatedButton
              variant="outline"
              asChild
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                LogIn
              </Link>
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              asChild
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link to="/company-login" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                LogIn as Company
              </Link>
            </AnimatedButton>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src="/vite.svg"
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
              <DropdownMenuItem>
                <Link to="/login" className="flex w-full">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}