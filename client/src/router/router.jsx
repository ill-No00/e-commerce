import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../components/layouts/authLayout.jsx";
import PublicLayout from "../components/layouts/publicLayout.jsx";
import AdminLayout from "../components/layouts/adminLayout.jsx";
import UserLayout from "../components/layouts/userLayout.jsx";
import ErrorPage from "../pages/error/errorPage.jsx";
import LandingPage from "../pages/public/LandingPage.jsx";
import Shop from "../pages/public/shop.jsx";
import Cart from "../pages/public/cart.jsx";
import ProductDetail from "../pages/public/ProductDetail.jsx";
import LoginPage from "../pages/public/LoginPage.jsx";
import SignupPage from "../pages/public/SignupPage.jsx";
import SignupProfilePage from "../pages/public/SignupProfilePage.jsx";
import AdminOverview from "../pages/admin/overview.jsx";
import AdminOrders from "../pages/admin/orders.jsx";
import AdminInventory from "../pages/admin/inventory.jsx";
import AdminCrew from "../pages/admin/crew.jsx";
import AdminSettings from "../pages/admin/settings.jsx";
import ShippingPage from "../pages/public/checkout/ShippingPage.jsx";
import PaymentPage from "../pages/public/checkout/PaymentPage.jsx";
import ReviewPage from "../pages/public/checkout/ReviewPage.jsx";
import BuilderPage from "../pages/public/builder.jsx";
import AccountLayout from "../components/layouts/accountLayout.jsx";
import AccountOrders from "../pages/account/AccountOrders.jsx";
import AccountCrew from "../pages/account/AccountCrew.jsx";
import AccountSettings from "../pages/account/AccountSettings.jsx";
import AccountWishlist from "../pages/account/AccountWishlist.jsx";
import RequireAuth from "../guards/requireAuth.jsx";
import RequireAdmin from "../guards/requireAdmin.jsx";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <LandingPage /> },
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <SignupPage /> },
          { path: "/signup/profile", element: <RequireAuth><SignupProfilePage /></RequireAuth> },
          { path: "/shop", element: <Shop /> },
          { path: "/shop/:id", element: <ProductDetail /> },
          {
            path: "/account",
            element: <RequireAuth><AccountLayout /></RequireAuth>,
            children: [
              { index: true, element: <Navigate to="/account/orders" replace /> },
              { path: "orders", element: <AccountOrders /> },
              { path: "crew", element: <AccountCrew /> },
              { path: "settings", element: <AccountSettings /> },
              { path: "wishlist", element: <AccountWishlist /> },
            ],
          },
          { path: "/cart", element: <Cart /> },
          { path: "/checkout/shipping", element: <ShippingPage /> },
          { path: "/checkout/payment", element: <PaymentPage /> },
          { path: "/checkout/review", element: <ReviewPage /> },
          { path: "/builder", element: <BuilderPage /> },
        ],
      },
      {
        path: "/admin",
        element: <RequireAdmin><AdminLayout /></RequireAdmin>,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <AdminOverview /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "inventory", element: <AdminInventory /> },
          { path: "crew", element: <AdminCrew /> },
          { path: "settings", element: <AdminSettings /> },
        ],
      },
      {
        path: "/dashboard",
        element: <RequireAuth><UserLayout /></RequireAuth>,
        errorElement: <ErrorPage />,
        children: [],
      },
    ],
  },
]);
