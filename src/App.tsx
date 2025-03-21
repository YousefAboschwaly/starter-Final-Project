import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "./MyComponents/Home";
import About from "./MyComponents/About";
import NotFound from "./MyComponents/NotFound";
import Layout from "./MyComponents/Layout";
import Login from "./MyComponents/Login";
import SignUp from "./MyComponents/SignUp";
import Client from "./Pages/Client";
import Company from "./Pages/JoinUs/Company";
import Engineer from "./Pages/JoinUs/Engineer";
import Technical from "./Pages/JoinUs/Technical";
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

// Initialize QueryClient outside the component
const queryClient = new QueryClient();

function App() {
  const routes = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
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
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
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
        { path: "engineer", element: <Engineer /> },
        { path: "consultative", element: <Technical /> },
        { path: "*", element: <NotFound /> }, // Wildcard route for 404
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <UserContextProvider>
        <RouterProvider router={routes} />
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
