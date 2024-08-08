
import styles from "./detail.module.css";
import Navbar from "../../components/navbar/index"
import CrearPresupuesto from "../../components/Crear Presupuesto/index";
const Detail = () =>{ 
   
    return(
        <div className={styles.container}>
            <Navbar></Navbar>
            <h4>Presupuestos</h4>
            <CrearPresupuesto></CrearPresupuesto>
        </div>
    );
}
export default Detail;