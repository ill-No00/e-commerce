import { Outlet } from "react-router-dom";
import Footer from "../reusable/footer";
import Header from "../reusable/header";






export default function PublicLayout() {
  return (
    <>
        <Header />
        
        <main>
            <Outlet />
        </main>

        <Footer />

    </>
  )
}