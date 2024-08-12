import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./mPresupuestos.module.css";

function mPresupuestos() {
    const [presupuestos, setPresupuestos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerPresupuestos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "proyectos"));
                const listaPresupuestos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("Presupuestos recuperados:", listaPresupuestos); // Log para depuración
                setPresupuestos(listaPresupuestos);
            } catch (err) {
                console.error("Error al obtener presupuestos: ", err);
                setError("Error al cargar los presupuestos.");
            }
        };
        

        obtenerPresupuestos();
    }, []);

    return (
        <div className={styles.container}>
            <h4>Lista de Presupuestos</h4>
            {error ? (
                <p className={styles.error}>{error}</p>
            ) : (
                <ul className={styles.lista}>
                    {presupuestos.map(presupuesto => (
                        <li key={presupuesto.id} className={styles.item}>
                            <div>
                                <strong>{presupuesto.nombre}</strong> - Total: ${presupuesto.total}
                            </div>
                            <button onClick={() => verDetalles(presupuesto.id)}>Ver detalles</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const verDetalles = (id) => {
    console.log(`Ver detalles del presupuesto con ID: ${id}`);
};

export default mPresupuestos;
