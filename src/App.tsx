"use client"

import type React from "react"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { lazy, useState } from "react"
import ProtectedRoute from "./MyComponents/ProtectedRoute"
import UserContextProvider from "./Contexts/UserContext"
import { CartProvider } from "./Contexts/CartContext.tsx"
import { FilterProvider } from "./Contexts/FilterContext.tsx"
import { ErrorBoundary } from "./MyComponents/error-boundary"
import { RouteLoading } from "./MyComponents/route-loading"

// Lazy load all components
const Home = lazy(() => import("./Pages/Home/Home"))
const About = lazy(() => import("./MyComponents/About"))
const NotFound = lazy(() => import("./MyComponents/NotFound"))
const Layout = lazy(() => import("./MyComponents/Layout"))
const Login = lazy(() => import("./MyComponents/Login"))
const SignUp = lazy(() => import("./MyComponents/SignUp"))
const Client = lazy(() => import("./Pages/Client"))
const Company = lazy(() => import("./Pages/JoinUs/Company"))
const ForgetPassword = lazy(() => import("./Pages/ForgetPassword"))
const AccessAccount = lazy(() => import("./MyComponents/AccessAccount"))
const ProfileEditor = lazy(() => import("./Pages/profile-editor"))
const Profile = lazy(() => import("./Pages/profile"))
const Project = lazy(() => import("./Pages/project"))
const AddProduct = lazy(() => import("./Pages/AddProduct"))
const ProductList = lazy(() => import("./Pages/ProductList"))
const EditProduct = lazy(() => import("./Pages/JoinUs/EditProduct"))
const Viewdetails = lazy(() => import("./Pages/Viewdetails.tsx"))
const ShoppingCart = lazy(() => import("./Pages/Cart/ShoppingCart.tsx"))
const OrderSuccess = lazy(() => import("./Pages/Cart/Order-Success.tsx"))
const OrdersPage = lazy(() => import("./Pages/UserPages/OrdersPage.tsx"))
const WishlistPage = lazy(() => import("./Pages/UserPages/WishlistPage.tsx"))
const ProfilePage = lazy(() => import("./Pages/UserPages/ProfilePage.tsx"))
const AddressesPage = lazy(() => import("./Pages/UserPages/AddressesPage.tsx"))
const PaymentsPage = lazy(() => import("./Pages/UserPages/PaymentsPage.tsx"))
const NotificationsPage = lazy(() => import("./Pages/UserPages/NotificationsPage.tsx"))
const UsrLayout = lazy(() => import("./Pages/UserPages/components/Layout"))
const OrderDetailsPage = lazy(() => import("./Pages/UserPages/OrderDetailsPage.tsx"))
const EngineerDetails = lazy(() => import("./Pages/LandingPage/TopEngineers/EngineerDetails.tsx"))
const TechnicalWorkerDetails = lazy(() => import("./Pages/LandingPage/TopWorkers/TechnicalWorkerDetails.tsx"))
const ProductsPage = lazy(() => import("./Pages/AllAsks/Asks.tsx"))
const MyAsksPage = lazy(() =>
  import("./Pages/AllAsks/components/my-asks-page.tsx").then((module) => ({ default: module.MyAsksPage })),
)
const AskDetailsPage = lazy(() =>
  import("./Pages/AllAsks/components/ask-details-page.tsx").then((module) => ({ default: module.AskDetailsPage })),
)
const Ask = lazy(() => import("./Pages/Ask/Ask.tsx"))
const WebAiPage = lazy(() => import("./Pages/WebAiPage.tsx"))

// Initialize QueryClient outside the component
const queryClient = new QueryClient()

// Higher-order component using RouteLoading (combines Suspense + ErrorBoundary)
const SuspenseWrapper = ({ children, loadingMessage }: { children: React.ReactNode; loadingMessage?: string }) => (
  <RouteLoading loadingMessage={loadingMessage}>{children}</RouteLoading>
)

// Protected Route with RouteLoading (combines ProtectedRoute + Suspense + ErrorBoundary)
const ProtectedSuspenseRoute = ({
  children,
  loadingMessage,
}: { children: React.ReactNode; loadingMessage?: string }) => (
  <ProtectedRoute>
    <RouteLoading loadingMessage={loadingMessage}>{children}</RouteLoading>
  </ProtectedRoute>
)

function App() {
  const [showMyAsks, setShowMyAsks] = useState(false)

  const routes = createBrowserRouter([
    {
      path: "",
      element: (
        <SuspenseWrapper loadingMessage="Loading application...">
          <Layout />
        </SuspenseWrapper>
      ),
      children: [
        {
          index: true,
          element: (
            <SuspenseWrapper loadingMessage="Loading home page...">
              <Home />
            </SuspenseWrapper>
          ),
        },
        {
          path: "edit_profile",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading profile editor...">
              <ProfileEditor />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading profile...">
              <Profile />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "about",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading about page...">
              <About />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "project/:projectId",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading project details...">
              <Project />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "addproduct",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading product form...">
              <AddProduct />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "editproduct/:productId",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading product editor...">
              <EditProduct />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "productlist",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading product list...">
              <ProductList />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "Ask",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading ask form...">
              <Ask />
            </ProtectedSuspenseRoute>
          ),
        },
        // All Asks Part
        {
          path: "All-Asks",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading asks...">
              <ProductsPage showMyAsks={showMyAsks} setShowMyAsks={setShowMyAsks} />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/AskEngineer",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading engineer asks...">
              <MyAsksPage selectedServiceType="engineer" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/AskWorker",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading worker asks...">
              <MyAsksPage selectedServiceType="worker" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/RequestDesign",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading design requests...">
              <MyAsksPage selectedServiceType="request-design" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/RenovateHome",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading renovation requests...">
              <MyAsksPage selectedServiceType="home-renovate" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/CustomPackage",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading custom packages...">
              <MyAsksPage selectedServiceType="custom-package" />
            </ProtectedSuspenseRoute>
          ),
        },
        /* Ask Details pages */
        {
          path: "/:askType/:askId",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading ask details...">
              <AskDetailsPage />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/TryAI",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading AI assistant...">
              <WebAiPage />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "products/:id",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading product details...">
              <Viewdetails />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading shopping cart...">
              <ShoppingCart />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "order-success",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading order confirmation...">
              <OrderSuccess />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "engineers/:id",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading engineer profile...">
              <EngineerDetails />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "technical-workers/:id",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading worker profile...">
              <TechnicalWorkerDetails />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/",
          element: (
            <SuspenseWrapper loadingMessage="Loading dashboard...">
              <UsrLayout />
            </SuspenseWrapper>
          ),
          children: [
            {
              index: true,
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading orders...">
                  <OrdersPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading orders...">
                  <OrdersPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "orders/:id",
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading order details...">
                  <OrderDetailsPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "wishlist",
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading wishlist...">
                  <WishlistPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "user-profile",
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading user profile...">
                  <ProfilePage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "addresses",
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading addresses...">
                  <AddressesPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "payments",
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading payment methods...">
                  <PaymentsPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "notifications",
              element: (
                <ProtectedSuspenseRoute loadingMessage="Loading notifications...">
                  <NotificationsPage />
                </ProtectedSuspenseRoute>
              ),
            },
          ],
        },
        {
          path: "client",
          element: (
            <SuspenseWrapper loadingMessage="Loading authentication...">
              <Client />
            </SuspenseWrapper>
          ),
          children: [
            {
              index: true,
              element: (
                <SuspenseWrapper loadingMessage="Loading login...">
                  <Login />
                </SuspenseWrapper>
              ),
            },
            {
              path: "signup",
              element: (
                <SuspenseWrapper loadingMessage="Loading signup...">
                  <SignUp />
                </SuspenseWrapper>
              ),
            },
          ],
        },
        {
          path: "forgot-password",
          element: (
            <SuspenseWrapper loadingMessage="Loading password recovery...">
              <ForgetPassword />
            </SuspenseWrapper>
          ),
        },
        {
          path: "access-account/:email",
          element: (
            <SuspenseWrapper loadingMessage="Loading account access...">
              <AccessAccount />
            </SuspenseWrapper>
          ),
        },
        {
          path: "join-as/:userType",
          element: (
            <SuspenseWrapper loadingMessage="Loading registration...">
              <Company />
            </SuspenseWrapper>
          ),
        },
        {
          path: "*",
          element: (
            <SuspenseWrapper loadingMessage="Loading page...">
              <NotFound />
            </SuspenseWrapper>
          ),
        },
      ],
    },
  ])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <UserContextProvider>
          <CartProvider>
            <FilterProvider>
              <RouterProvider router={routes} />
            </FilterProvider>
          </CartProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
