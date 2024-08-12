// Archivo: src/components/DPresupuesto.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./detallePresupuesto.module.css";
import Navbar from "../navbar/index"
function DPresupuesto() {
    const { id } = useParams(); // Obtener el id del presupuesto de la URL
    const [presupuesto, setPresupuesto] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            try {
                const docRef = doc(db, "proyectos", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPresupuesto(docSnap.data());
                } else {
                    setError("Presupuesto no encontrado.");
                }
            } catch (err) {
                console.error("Error al obtener el presupuesto: ", err);
                setError("Error al cargar el presupuesto.");
            }
        };

        obtenerPresupuesto();
    }, [id]);

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <>
            <Navbar></Navbar>
        <div className={styles.container}>
            <h4>Detalles del Presupuesto</h4>
            {presupuesto ? (
                <div>
                    <p><strong>Nombre del Proyecto:</strong> {presupuesto.nombre}</p>
                    <p><strong>Descripción:</strong> {presupuesto.descripcion}</p>
                    <p><strong>Total:</strong> ${presupuesto.total}</p>

                    <h5>Componentes:</h5>
                    {presupuesto.componentes.map((componente, index) => (
                        <div key={index} className={styles.componente}>
                            <p><strong>Nombre:</strong> {componente.nombre}</p>
                            <p><strong>Descripción:</strong> {componente.descripcion}</p>
                            <p><strong>Precio:</strong> {componente.precio}</p>
                            <p><strong>Cantidad:</strong> {componente.cantidad}</p>

                            {componente.subcomponentes && componente.subcomponentes.length > 0 && (
                                <div>
                                    <h6>Subcomponentes:</h6>
                                    {componente.subcomponentes.map((subcomponente, subIndex) => (
                                        <div key={subIndex} className={styles.subcomponente}>
                                            <p><strong>Nombre:</strong> {subcomponente.nombre}</p>
                                            <p><strong>Descripción:</strong> {subcomponente.descripcion}</p>
                                            <p><strong>Precio:</strong> {subcomponente.precio}</p>
                                            <p><strong>Cantidad:</strong> {subcomponente.cantidad}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
        </>
    );
}

export default DPresupuesto;
