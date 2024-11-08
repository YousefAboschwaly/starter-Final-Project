import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Home from "./MyComponents/Home";
import About from "./MyComponents/About";
import Parent from "./MyComponents/Parent";
import NotFound from "./MyComponents/NotFound";
import Layout from "./MyComponents/Layout";
import Products from "./MyComponents/Products";
import Login from "./MyComponents/Login";
import SignUp from "./MyComponents/SignUp";

function App() {
  const routes = createBrowserRouter([
    { path: "", element: <Layout /> , children:[
      { index:true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "parent", element: <Parent /> },
      { path: "products", element: <Products /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      {path:'*' , element:<NotFound/>}
    ]},
 
  ]);

  return (
    <>
     <RouterProvider router={routes}/> 
    </>
  );
}

export default App;
