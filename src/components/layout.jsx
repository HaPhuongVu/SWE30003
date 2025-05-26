import { Outlet } from "react-router"
import NavBar from "./nav-bar"

function Layout() {
    return (
      <>
        <NavBar />
        <Outlet />
      </>
    )
  }

export default Layout