import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Home from "./MyComponents/Home";
import About from "./MyComponents/About";
import NotFound from "./MyComponents/NotFound";
import Layout from "./MyComponents/Layout";
import Products from "./MyComponents/Products";
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
import ProfileEditor from './Pages/profile-editor';
import Profile from "./Pages/profile";


function App() {
  const routes = createBrowserRouter([
    { path: "", element: <Layout /> , children:[
      {path:'edit_profile' , element: <ProtectedRoute><ProfileEditor/></ProtectedRoute>},
      {path:'profile' , element:<ProtectedRoute><Profile/></ProtectedRoute>},
      { index:true, element:<ProtectedRoute><Home /></ProtectedRoute>  },
      { path: "about", element:<ProtectedRoute><About /></ProtectedRoute> },
      { path: "products", element:<ProtectedRoute><Products /> </ProtectedRoute>},
      { path: "client", element: <Client /> , children:[
        {index:true ,  element: <Login/>},
        { path: "signup", element: <SignUp /> },
      ] },
      {path:'forgot-password' , element:<ForgetPassword/>},
      {path:'access-account/:email' , element:<AccessAccount/>},
      {path:'join-as/:userType' , element:<Company/>},
      {path:'engineer' , element:<Engineer/>},
      {path:'consultative' , element:<Technical/>},



      {path:'*' , element:<NotFound/>}
    ]},
 
  ]);

  return (
    <>
    
    <UserContextProvider>

        <RouterProvider router={routes}/> 
    </UserContextProvider>
    </>
  );
}

export default App;
