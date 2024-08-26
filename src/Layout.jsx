import { Outlet } from "react-router-dom";
import "./layout.css";
const Layout = () => {
    return(
        <div>
            
                <Outlet />
            
        </div>
    )
}

export default Layout