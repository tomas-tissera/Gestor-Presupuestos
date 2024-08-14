import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./mPresupuestos.module.css";
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'; // Importar el componente Spinner
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { TbTrashX } from "react-icons/tb";

function mPresupuestos() {
    const [presupuestos, setPresupuestos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para la carga
    const navigate = useNavigate(); // Hook para navegación

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
            } finally {
                setLoading(false); // Ocultar el spinner cuando la carga termine
            }
        };

        obtenerPresupuestos();
    }, []);

    const verDetalles = (id) => {
        navigate(`/presupuesto/${id}`); // Navegar a la ruta de detalles del presupuesto
    };

    const eliminarPresupuesto = async (id) => {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: "Una vez eliminado, no podrás recuperar este presupuesto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "proyectos", id));
                setPresupuestos(presupuestos.filter(presupuesto => presupuesto.id !== id)); // Remover el presupuesto del estado
                Swal.fire(
                    'Eliminado',
                    'El presupuesto ha sido eliminado.',
                    'success'
                );
            } catch (err) {
                console.error("Error al eliminar el presupuesto: ", err);
                setError("Error al eliminar el presupuesto.");
            }
        }
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <h4>Lista de Presupuestos</h4>
                    {error ? (
                        <p className={styles.error}>{error}</p>
                    ) : (
                        <ul className={styles.lista}>
                            {presupuestos.map(presupuesto => (
                                <li key={presupuesto.id} className={styles.item}>
                                    <div className={styles.itemText}>
                                        <strong>{presupuesto.nombre}</strong> - Total: ${presupuesto.total}
                                    </div>
                                    <button onClick={() => verDetalles(presupuesto.id)}>Ver detalles</button>
                                    
                                    <button onClick={() => eliminarPresupuesto(presupuesto.id)} className={styles.deleteButton}>
                                        Eliminar
                                        <TbTrashX className={styles.deleteIcon}/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default mPresupuestos;
