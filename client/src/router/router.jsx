import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../components/layouts/publicLayout.jsx";
import AdminLayout from "../components/layouts/adminLayout.jsx";
import UserLayout from "../components/layouts/userLayout.jsx";
import ErrorPage from "../pages/error/errorPage.jsx";
import LandingPage from "../pages/public/LandingPage.jsx";
import Shop from "../pages/public/shop.jsx";
import Cart from "../pages/public/cart.jsx";
import ProductDetail from "../pages/public/ProductDetail.jsx";
import AdminOverview from "../pages/admin/overview.jsx";
import AdminOrders from "../pages/admin/orders.jsx";
import AdminInventory from "../pages/admin/inventory.jsx";
import AdminCrew from "../pages/admin/crew.jsx";
import AdminSettings from "../pages/admin/settings.jsx";
import ShippingPage from "../pages/public/checkout/ShippingPage.jsx";
import PaymentPage from "../pages/public/checkout/PaymentPage.jsx";
import ReviewPage from "../pages/public/checkout/ReviewPage.jsx";
import BuilderPage from "../pages/public/builder.jsx";






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
                element: <ProductDetail />
            },
            {
                path: "/account",
                element: <div>Profile</div>
            },
            {
                path: "/cart",
                element: <Cart />
            },
            {
                path: "/checkout/shipping",
                element: <ShippingPage />
            },
            {
                path: "/checkout/payment",
                element: <PaymentPage />
            },
            {
                path: "/checkout/review",
                element: <ReviewPage />
            },
            {
                path: "/builder",
                element: <BuilderPage />
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
            {
                index: true,
                element: <AdminOverview />
            },
            {
                path : 'orders',
                element: <AdminOrders />
            },
            {
                path : 'inventory',
                element: <AdminInventory />
            },
            {
                path : 'crew',
                element: <AdminCrew />
            },
            {
                path : 'settings',
                element: <AdminSettings />
            }
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