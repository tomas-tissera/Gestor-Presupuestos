import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./detallePresupuesto.module.css";
import Navbar from "../navbar/index";
import { Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FaDeleteLeft } from 'react-icons/fa6';
import GenerarPDF from '../GenerarPDF/index'; // Importa el componente de generación de PDF

function DPresupuesto() {
    const { id } = useParams();
    const [presupuesto, setPresupuesto] = useState(null);
    const [error, setError] = useState(null);
    const [nuevoComponente, setNuevoComponente] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: 1
    });
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSaveNotice, setShowSaveNotice] = useState(false);

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        obtenerPresupuesto();
    }, [id]);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedComponentes = [...presupuesto.componentes];
        updatedComponentes[index] = {
            ...updatedComponentes[index],
            [name]: name === 'precio' ? parseFloat(value.replace('$', '')) || 0 : value
        };
        setPresupuesto({
            ...presupuesto,
            componentes: updatedComponentes
        });
        setShowSaveNotice(true); // Mostrar notificación para guardar cambios
    };

    const handleCantidadChange = (index, e) => {
        const cantidad = parseInt(e.target.value, 10) || 1;
        const updatedComponentes = [...presupuesto.componentes];
        updatedComponentes[index].cantidad = cantidad;
        setPresupuesto({
            ...presupuesto,
            componentes: updatedComponentes
        });
        setShowSaveNotice(true); // Mostrar notificación para guardar cambios
    };

    const calcularTotal = (componentes) => {
        return componentes.reduce((total, comp) => {
            const precio = parseFloat(comp.precio) || 0;
            const cantidad = parseInt(comp.cantidad, 10) || 1;
            return total + (precio * cantidad);
        }, 0);
    };

    const agregarComponente = async () => {
        const precioNumerico = parseFloat(nuevoComponente.precio.replace('$', '')) || 0;
        const nuevoComponenteConPrecio = {
            ...nuevoComponente,
            precio: precioNumerico
        };

        try {
            setIsLoading(true); // Mostrar el círculo de carga
            const updatedComponentes = [...presupuesto.componentes, nuevoComponenteConPrecio];
            const updatedTotal = calcularTotal(updatedComponentes);

            await updateDoc(doc(db, "proyectos", id), {
                componentes: updatedComponentes,
                total: updatedTotal
            });

            setPresupuesto({
                ...presupuesto,
                componentes: updatedComponentes,
                total: updatedTotal
            });

            setNuevoComponente({ nombre: '', descripcion: '', precio: '', cantidad: 1 });
            setAlertMessage('Componente agregado correctamente.');
        } catch (err) {
            console.error("Error al agregar el componente: ", err);
            setError("Error al agregar el componente.");
        } finally {
            setIsLoading(false);
        }
    };

    const eliminarComponente = async (index) => {
        try {
            setIsLoading(true);
            const updatedComponentes = presupuesto.componentes.filter((_, i) => i !== index);
            const updatedTotal = calcularTotal(updatedComponentes);

            await updateDoc(doc(db, "proyectos", id), {
                componentes: updatedComponentes,
                total: updatedTotal
            });

            setPresupuesto({
                ...presupuesto,
                componentes: updatedComponentes,
                total: updatedTotal
            });
        } catch (err) {
            console.error("Error al eliminar el componente: ", err);
            setError("Error al eliminar el componente.");
        } finally {
            setIsLoading(false);
        }
    };

    const guardarCambios = async () => {
        try {
            setIsLoading(true);
            const updatedTotal = calcularTotal(presupuesto.componentes);

            await updateDoc(doc(db, "proyectos", id), {
                componentes: presupuesto.componentes,
                total: updatedTotal
            });

            setPresupuesto({
                ...presupuesto,
                total: updatedTotal
            });
            setAlertMessage('Cambios guardados correctamente.');
            setShowSaveNotice(false); // Ocultar notificación de guardar cambios
        } catch (err) {
            console.error("Error al guardar los cambios: ", err);
            setError("Error al guardar los cambios.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerarPDF = () => {
        if (presupuesto) {
            GenerarPDF(presupuesto);
        }
    };

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h4>Detalles del Presupuesto</h4>
                {isLoading && <Spinner animation="border" variant="primary" />} {/* Círculo de carga */}
                {alertMessage && <Alert variant="success">{alertMessage}</Alert>} {/* Alerta de operación exitosa */}
                {showSaveNotice && <Alert variant="warning">Se han modificado componentes, no olvide guardar los cambios.</Alert>} {/* Notificación de guardar cambios */}
                
                {presupuesto ? (
                    <div>
                        <p><strong>Nombre del Proyecto:</strong> {presupuesto.nombre}</p>
                        <p><strong>Descripción:</strong> {presupuesto.descripcion}</p>
                        <p><strong>Total:</strong> ${presupuesto.total}</p>

                        <h5>Componentes:</h5>
                        {presupuesto.componentes.map((componente, index) => (
                            <Form.Group as={Row} className="mb-3" key={index}>
                                <Col sm="3">
                                    <Form.Control
                                        as="textarea"
                                        rows={1}
                                        placeholder="Nombre"
                                        name="nombre"
                                        value={componente.nombre}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </Col>
                                <Col sm="5">
                                    <Form.Control
                                        as="textarea"
                                        rows={1}
                                        placeholder="Descripción"
                                        name="descripcion"
                                        value={componente.descripcion}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </Col>
                                <Col sm="2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Precio"
                                        name="precio"
                                        value={`$${componente.precio}`}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </Col>
                                <Col sm="1">
                                    <Form.Control
                                        type="number"
                                        placeholder="Cantidad"
                                        name="cantidad"
                                        value={componente.cantidad}
                                        onChange={(e) => handleCantidadChange(index, e)}
                                        min={1}
                                        max={10}
                                    />
                                </Col>
                                <Col sm="1">
                                    <FaDeleteLeft
                                        className={styles.deletIcon}
                                        onClick={() => eliminarComponente(index)}
                                    />
                                </Col>
                            </Form.Group>
                        ))}

                        <h5>Añadir Componente</h5>
                        <Form.Group as={Row} className="mb-3">
                            <Col sm="3">
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Nombre"
                                    name="nombre"
                                    value={nuevoComponente.nombre}
                                    onChange={(e) => setNuevoComponente({ ...nuevoComponente, nombre: e.target.value })}
                                />
                            </Col>
                            <Col sm="5">
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Descripción"
                                    name="descripcion"
                                    value={nuevoComponente.descripcion}
                                    onChange={(e) => setNuevoComponente({ ...nuevoComponente, descripcion: e.target.value })}
                                />
                            </Col>
                            <Col sm="2">
                                <Form.Control
                                    type="text"
                                    placeholder="Precio"
                                    name="precio"
                                    value={nuevoComponente.precio ? `$${nuevoComponente.precio}` : ''}
                                    onChange={(e) => setNuevoComponente({ ...nuevoComponente, precio: e.target.value.replace('$', '') })}
                                />
                            </Col>
                            <Col sm="1">
                                <Form.Control
                                    type="number"
                                    placeholder="Cantidad"
                                    name="cantidad"
                                    value={nuevoComponente.cantidad}
                                    onChange={(e) => setNuevoComponente({ ...nuevoComponente, cantidad: parseInt(e.target.value, 10) })}
                                    min={1}
                                    max={10}
                                />
                            </Col>
                            <Col sm="1">
                                <Button variant="primary" onClick={agregarComponente}>Añadir</Button>
                            </Col>
                        </Form.Group>

                        {showSaveNotice && (
                            <Button variant="success" onClick={guardarCambios}>Guardar Cambios</Button>
                        )}
                        <Button variant="secondary" onClick={handleGenerarPDF}>Generar PDF</Button>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>
        </>
    );
}

export default DPresupuesto;
