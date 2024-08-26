import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./profile.css";
import Home from "./views/home";
import Navbar from "./componets/navbar/index";
import Presupuestos from "./componets/mostrar Presupuestos/index";
const Profile = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const logoutUser = async (e) => {
        e.preventDefault();

        await signOut(auth);
        navigate("/");
    }


    return(
        <>
            <Navbar/>
            <Presupuestos></Presupuestos>
        </>
    )    
}

export default Profile