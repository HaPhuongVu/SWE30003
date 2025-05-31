import { Outlet } from "react-router"
import NavBar from "./nav-bar"
import Footer from "./footer"

function Layout() {
    return (
      <>
        <NavBar />
        <Outlet />
        <Footer />
      </>
    )
  }

export default Layout