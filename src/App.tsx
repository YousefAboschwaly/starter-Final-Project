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
const ShopNow = lazy(() => import("./Pages/Ask/ShopNow/ShopNow.tsx"))

// Initialize QueryClient outside the component
const queryClient = new QueryClient()

// Higher-order component to wrap routes with Suspense and Error Boundary
const SuspenseWrapper = ({ children, loadingMessage }: { children: React.ReactNode; loadingMessage?: string }) => (
  <RouteLoading loadingMessage={loadingMessage}>{children}</RouteLoading>
)

// Protected Route with Suspense and Error Boundary
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
        <SuspenseWrapper>
          <Layout />
        </SuspenseWrapper>
      ),
      children: [
        {
          index: true,
          element: (
            <SuspenseWrapper>
              <Home />
            </SuspenseWrapper>
          ),
        },
        {
          path: "shop-now",
          element: (
            <ProtectedSuspenseRoute loadingMessage="Loading shop...">
              <ShopNow />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "edit_profile",
          element: (
            <ProtectedSuspenseRoute>
              <ProfileEditor />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedSuspenseRoute>
              <Profile />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "about",
          element: (
            <ProtectedSuspenseRoute>
              <About />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "project/:projectId",
          element: (
            <ProtectedSuspenseRoute>
              <Project />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "addproduct",
          element: (
            <ProtectedSuspenseRoute>
              <AddProduct />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "editproduct/:productId",
          element: (
            <ProtectedSuspenseRoute>
              <EditProduct />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "productlist",
          element: (
            <ProtectedSuspenseRoute>
              <ProductList />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "Ask",
          element: (
            <ProtectedSuspenseRoute>
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
            <ProtectedSuspenseRoute>
              <MyAsksPage selectedServiceType="engineer" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/AskWorker",
          element: (
            <ProtectedSuspenseRoute>
              <MyAsksPage selectedServiceType="worker" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/RequestDesign",
          element: (
            <ProtectedSuspenseRoute>
              <MyAsksPage selectedServiceType="request-design" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/RenovateHome",
          element: (
            <ProtectedSuspenseRoute>
              <MyAsksPage selectedServiceType="home-renovate" />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/MyAsks/CustomPackage",
          element: (
            <ProtectedSuspenseRoute>
              <MyAsksPage selectedServiceType="custom-package" />
            </ProtectedSuspenseRoute>
          ),
        },
        /* Ask Details pages */
        {
          path: "/:askType/:askId",
          element: (
            <ProtectedSuspenseRoute>
              <AskDetailsPage />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/TryAI",
          element: (
            <ProtectedSuspenseRoute>
              <WebAiPage />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "products/:id",
          element: (
            <ProtectedSuspenseRoute>
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
            <ProtectedSuspenseRoute>
              <OrderSuccess />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "engineers/:id",
          element: (
            <ProtectedSuspenseRoute>
              <EngineerDetails />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "technical-workers/:id",
          element: (
            <ProtectedSuspenseRoute>
              <TechnicalWorkerDetails />
            </ProtectedSuspenseRoute>
          ),
        },
        {
          path: "/",
          element: (
            <SuspenseWrapper>
              <UsrLayout />
            </SuspenseWrapper>
          ),
          children: [
            {
              index: true,
              element: (
                <ProtectedSuspenseRoute>
                  <OrdersPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedSuspenseRoute>
                  <OrdersPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "orders/:id",
              element: (
                <ProtectedSuspenseRoute>
                  <OrderDetailsPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "wishlist",
              element: (
                <ProtectedSuspenseRoute>
                  <WishlistPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "user-profile",
              element: (
                <ProtectedSuspenseRoute>
                  <ProfilePage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "addresses",
              element: (
                <ProtectedSuspenseRoute>
                  <AddressesPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "payments",
              element: (
                <ProtectedSuspenseRoute>
                  <PaymentsPage />
                </ProtectedSuspenseRoute>
              ),
            },
            {
              path: "notifications",
              element: (
                <ProtectedSuspenseRoute>
                  <NotificationsPage />
                </ProtectedSuspenseRoute>
              ),
            },
          ],
        },
        {
          path: "client",
          element: (
            <SuspenseWrapper>
              <Client />
            </SuspenseWrapper>
          ),
          children: [
            {
              index: true,
              element: (
                <SuspenseWrapper>
                  <Login />
                </SuspenseWrapper>
              ),
            },
            {
              path: "signup",
              element: (
                <SuspenseWrapper>
                  <SignUp />
                </SuspenseWrapper>
              ),
            },
          ],
        },
        {
          path: "forgot-password",
          element: (
            <SuspenseWrapper>
              <ForgetPassword />
            </SuspenseWrapper>
          ),
        },
        {
          path: "access-account/:email",
          element: (
            <SuspenseWrapper>
              <AccessAccount />
            </SuspenseWrapper>
          ),
        },
        {
          path: "join-as/:userType",
          element: (
            <SuspenseWrapper>
              <Company />
            </SuspenseWrapper>
          ),
        },
        {
          path: "*",
          element: (
            <SuspenseWrapper>
              <NotFound />
            </SuspenseWrapper>
          ),
        },
      ],
    },
  ])

  return (
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
  )
}

export default App
