import Layout from "./Layout";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrearPresupuesto from "./componets/Crear Presupuesto/index"
import Info from "./views/InfoPage/index"
import PresupuestoDetail from "./componets/detalle Presupuesto/index"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path = "/" element = { <Layout></Layout> }>
            <Route index element = { <Login></Login> }></Route>
            <Route path = "/signup" element = { <Signup></Signup> } ></Route>
            <Route path = "/home" element = { <Profile></Profile> }></Route>
            
            <Route path="/crear" element = {<CrearPresupuesto></CrearPresupuesto>}></Route>
            <Route path="/info" element = {<Info></Info>}></Route>

            {/* Add a dynamic route to handle budget details */}
            <Route path="/presupuesto/:id" element={<PresupuestoDetail />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App