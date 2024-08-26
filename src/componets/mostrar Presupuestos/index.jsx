import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./mPresupuestos.module.css";
import { useNavigate } from 'react-router-dom';
import { Spinner, Form, Row, Col } from 'react-bootstrap'; // Importar componentes adicionales de Bootstrap
import Swal from 'sweetalert2'; 
import { TbTrashX } from "react-icons/tb";
import Navbar from "../navbar/index"
function mPresupuestos() {
    const [presupuestos, setPresupuestos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [estadoFiltro, setEstadoFiltro] = useState(''); // Estado para el filtro por estado
    const [buscarTitulo, setBuscarTitulo] = useState(''); // Estado para la búsqueda por título
    const navigate = useNavigate(); 

    useEffect(() => {
        const obtenerPresupuestos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "proyectos"));
                const listaPresupuestos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("Presupuestos recuperados:", listaPresupuestos);
                setPresupuestos(listaPresupuestos);
            } catch (err) {
                console.error("Error al obtener presupuestos: ", err);
                setError("Error al cargar los presupuestos.");
            } finally {
                setLoading(false);
            }
        };

        obtenerPresupuestos();
    }, []);

    const verDetalles = (id) => {
        navigate(`/presupuesto/${id}`); 
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
                setPresupuestos(presupuestos.filter(presupuesto => presupuesto.id !== id));
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

    // Filtrar presupuestos por estado y por título
    const presupuestosFiltrados = presupuestos.filter(presupuesto => {
        const coincideEstado = estadoFiltro ? presupuesto.estado === estadoFiltro : true;
        const coincideTitulo = presupuesto.nombre.toLowerCase().includes(buscarTitulo.toLowerCase());
        return coincideEstado && coincideTitulo;
    });

    return (
        <div>
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
                        <Form>
                            <Row className="mb-3">
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar por título"
                                        value={buscarTitulo}
                                        onChange={(e) => setBuscarTitulo(e.target.value)}
                                    />
                                </Col>
                                <Col sm="6">
                                    <Form.Select
                                        value={estadoFiltro}
                                        onChange={(e) => setEstadoFiltro(e.target.value)}
                                    >
                                        <option value="">Filtrar por estado</option>
                                        <option value="cotizado">Cotizado</option>
                                        <option value="en Proceso">En Proceso</option>
                                        <option value="pagado">Pagado</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form>
                        {error ? (
                            <p className={styles.error}>{error}</p>
                        ) : (
                            <ul className={styles.lista}>
                                {presupuestosFiltrados.map(presupuesto => (
                                    <li key={presupuesto.id} className={styles.item}>
                                        <div className={styles.itemText}>
                                            <strong>{presupuesto.nombre}</strong> - Total: ${presupuesto.total} - Estado: {presupuesto.estado}
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
        </div>
    );
}

export default mPresupuestos;
