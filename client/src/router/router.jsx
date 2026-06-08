import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/publicLayout.jsx";
import AdminLayout from "../layouts/adminLayout.jsx";
import UserLayout from "../layouts/userLayout.jsx";
import ErrorPage from "../pages/error/errorPage.jsx";
import LandingPage from "../pages/public/LandingPage.jsx";
import Shop from "../pages/public/shop.jsx";








export const router = createBrowserRouter([
  
    // public 
    {
        element: <PublicLayout />,
        errorElement: <ErrorPage />,    
        children: [
            {
                path: "/",
                element: <LandingPage />
            },
            {
                path: "/shop",
                element: <Shop />
            },
            {
                path : "/shop/:id",
                element: <div>Product Details</div>
            },
            {
                path: "/profile",
                element: <div>Profile</div>
            }
        ]
    },
    // admin 
    {
        path: "/admin",
        element: <AdminLayout />,
        loader: () => {
            // check if the user is admin or not 
            // if not admin redirect to login page 
        },
        errorElement: <ErrorPage />,    
        children: [
            {},
            {},
            {}
        ]       
    },
    // user
    {
        path: "/dashboard",
        element: <UserLayout />,
        loader: () => {
            // check if the user is logged in or not 
            // if not logged in redirect to login page 
        },
        errorElement: <ErrorPage />,    
        children: [
            {},
            {},
            {}
        ]       
    }
])