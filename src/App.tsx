import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "./Pages/Home/Home";
import About from "./MyComponents/About";
import NotFound from "./MyComponents/NotFound";
import Layout from "./MyComponents/Layout";
import Login from "./MyComponents/Login";
import SignUp from "./MyComponents/SignUp";
import Client from "./Pages/Client";
import Company from "./Pages/JoinUs/Company";
import ForgetPassword from "./Pages/ForgetPassword";
import ProtectedRoute from "./MyComponents/ProtectedRoute";
import UserContextProvider from "./Contexts/UserContext";
import AccessAccount from "./MyComponents/AccessAccount";
import ProfileEditor from "./Pages/profile-editor";
import Profile from "./Pages/profile";
import Project from "./Pages/project";
import AddProduct from "./Pages/AddProduct";
import ProductList from "./Pages/ProductList";
import EditProduct from "./Pages/JoinUs/EditProduct";
import Ask from "./Pages/Ask/Ask";
import Viewdetails from "./Pages/Viewdetails.tsx";
import { CartProvider } from "./Contexts/CartContext.tsx";
import ShoppingCart from "./Pages/Cart/ShoppingCart.tsx";
import OrderSuccess from "./Pages/Cart/Order-Success.tsx";
import OrdersPage from "./Pages/UserPages/OrdersPage.tsx";
import WishlistPage from "./Pages/UserPages/WishlistPage.tsx";
import ProfilePage from "./Pages/UserPages/ProfilePage.tsx";
import AddressesPage from "./Pages/UserPages/AddressesPage.tsx";
import PaymentsPage from "./Pages/UserPages/PaymentsPage.tsx";
import NotificationsPage from "./Pages/UserPages/NotificationsPage.tsx";
import UsrLayout from "./Pages/UserPages/components/Layout";
import OrderDetailsPage from "./Pages/UserPages/OrderDetailsPage.tsx";
import { FilterProvider } from "./Contexts/FilterContext.tsx";
import EngineerDetails from "./Pages/LandingPage/TopEngineers/EngineerDetails.tsx";
import TechnicalWorkerDetails from "./Pages/LandingPage/TopWorkers/TechnicalWorkerDetails.tsx";
import Asks from "./Pages/AllAsks/Asks.tsx";

// Initialize QueryClient outside the component
const queryClient = new QueryClient();

function App() {
  const routes = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "edit_profile",
          element: (
            <ProtectedRoute>
              <ProfileEditor />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },

        {
          path: "about",
          element: (
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          ),
        },
        {
          path: "project/:projectId",
          element: (
            <ProtectedRoute>
              <Project />
            </ProtectedRoute>
          ),
        },
        {
          path: "addproduct",
          element: (
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          ),
        },
        {
          path: "editproduct/:productId",
          element: (
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          ),
        },
        {
          path: "productlist",
          element: (
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          ),
        },
        {
          path: "Ask",
          element: (
            <ProtectedRoute>
              <Ask />
            </ProtectedRoute>
          ),
        },
        {
          path: "All-Asks",
          element: (
            <ProtectedRoute>
              <Asks />
            </ProtectedRoute>
          ),
        },
        {
          path: "products/:id",
          element: (
            <ProtectedRoute>
              <Viewdetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <ShoppingCart />
            </ProtectedRoute>
          ),
        },
        {
          path: "order-success",
          element: (
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          ),
        },
        {
          path: "engineers/:id",
          element: (
            <ProtectedRoute>
              <EngineerDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "technical-workers/:id",
          element: (
            <ProtectedRoute>
              <TechnicalWorkerDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "/",
          element: <UsrLayout />,
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "orders/:id",
              element: (
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "wishlist",
              element: (
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "user-profile",
              element: (
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              ),
            },
            {
              path: "addresses",
              element: (
                <ProtectedRoute>
                  <AddressesPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "payments",
              element: (
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "notifications",
              element: (
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              ),
            },
          ],
        },

        {
          path: "client",
          element: <Client />,
          children: [
            { index: true, element: <Login /> },
            { path: "signup", element: <SignUp /> },
          ],
        },
        { path: "forgot-password", element: <ForgetPassword /> },
        { path: "access-account/:email", element: <AccessAccount /> },
        { path: "join-as/:userType", element: <Company /> },
        { path: "*", element: <NotFound /> }, // Wildcard route for 404
      ],
    },
  ]);

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
  );
}

export default App;
