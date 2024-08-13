import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from "../views/home";
import Presupuestos from "../views/Presupuestos";
import Error404 from "../views/error 404";
import Profile from "../views/profile";
import DPresupuesto from "../components/detalle Presupuesto";
import InfoPage from "../views/InfoPage";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <Error404 />,
    },
    {
        path: "/presupuestos",
        element: <Presupuestos />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/presupuesto/:id",
        element: <DPresupuesto />,
    },
    {
        path: "/Info",
        element: <InfoPage />,
    },
]);

const MyRoutes = () => <RouterProvider router={router} />;

export default MyRoutes;
