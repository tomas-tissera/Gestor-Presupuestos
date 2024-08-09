
import styles from "./detail.module.css";
import Navbar from "../../components/navbar/index"
import CrearPresupuesto from "../../components/Crear Presupuesto/index";
const Detail = () =>{ 
   
    return(
        <div className={styles.container}>
            <Navbar></Navbar>
            <h4 className={styles.titulo}>Presupuestos</h4>
            <hr></hr>
            <CrearPresupuesto></CrearPresupuesto>
        </div>
    );
}
export default Detail;