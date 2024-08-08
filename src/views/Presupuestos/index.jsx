
import styles from "./detail.module.css";
import Navbar from "../../components/navbar/index"
const Detail = () =>{ 
   
    return(
        <div className={styles.container}>
            <Navbar></Navbar>
            <h4>Presupuestos</h4>
        </div>
    );
}
export default Detail;