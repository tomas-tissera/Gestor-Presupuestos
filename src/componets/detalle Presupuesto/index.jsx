import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./detallePresupuesto.module.css";
import Navbar from "../navbar/index";
import { Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FaDeleteLeft } from 'react-icons/fa6';
import GenerarPDF from '../GenerarPDF/index'; // Importa el componente de generación de PDF
import GenerarWord from "../Generar Word/index"
import Swal from 'sweetalert2';
import { MdAdd } from "react-icons/md";

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
    const [estadoPresupuesto, setEstadoPresupuesto] = useState('');

    const [url, setUrl] = useState('');
    const [aclaracion, setAclaracion] = useState('');
    const [metodoPago, setMetodoPago] = useState('');

    const [impuestos, setImpuestos] = useState([]); // Nuevo estado para los impuestos
    const [nuevoImpuesto, setNuevoImpuesto] = useState({
        nombre: '',
        porcentaje: ''
    });

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, "proyectos", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPresupuesto(data);
                    setEstadoPresupuesto(data.estado || 'cotizado');
                    setUrl(data.url || '');  // Cargar la URL si existe
                    setAclaracion(data.aclaracion || '');  // Cargar la URL si existe
                    setMetodoPago(data.metodoPago || '');
                    setImpuestos(data.impuestos || []); // Cargar los impuestos si existen
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


    const handleEstadoChange = (e) => {
        setEstadoPresupuesto(e.target.value);
        setShowSaveNotice(true);
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedComponentes = [...presupuesto.componentes];
        updatedComponentes[index] = {
            ...updatedComponentes[index],
            [name]: name === 'precio' ? parseInt(value.replace('$', ''), 10) || 0 : value
        };
        setPresupuesto({
            ...presupuesto,
            componentes: updatedComponentes
        });
        setShowSaveNotice(true);
    };

    const handleCantidadChange = (index, e) => {
        const cantidad = parseInt(e.target.value, 10) || 1;
        const updatedComponentes = [...presupuesto.componentes];
        updatedComponentes[index].cantidad = cantidad;
        setPresupuesto({
            ...presupuesto,
            componentes: updatedComponentes
        });
        setShowSaveNotice(true);
    };

    const calcularTotal = (componentes, impuestos) => {
        const subtotal = componentes.reduce((total, comp) => {
            const precio = parseInt(comp.precio, 10) || 0;
            const cantidad = parseInt(comp.cantidad, 10) || 1;
            return total + (precio * cantidad);
        }, 0);

        const totalImpuestos = impuestos.reduce((total, imp) => {
            const porcentaje = parseFloat(imp.porcentaje) || 0;
            return total + (subtotal * (porcentaje / 100));
        }, 0);

        return subtotal + totalImpuestos;
    };

    const agregarComponente = async () => {
        const precioNumerico = parseInt(nuevoComponente.precio.replace('$', ''), 10) || 0;
        const nuevoComponenteConPrecio = {
            ...nuevoComponente,
            precio: precioNumerico
        };

        try {
            setIsLoading(true);
            const updatedComponentes = [...presupuesto.componentes, nuevoComponenteConPrecio];
            const updatedTotal = calcularTotal(updatedComponentes, impuestos);

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
            const updatedTotal = calcularTotal(updatedComponentes, impuestos);

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
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: "Una vez guardados los cambios, no podrás volver atrás.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                setIsLoading(true);
                const updatedTotal = calcularTotal(presupuesto.componentes);

                await updateDoc(doc(db, "proyectos", id), {
                    componentes: presupuesto.componentes,
                    total: updatedTotal,
                    estado: estadoPresupuesto
                });

                setPresupuesto({
                    ...presupuesto,
                    total: updatedTotal
                });
                Swal.fire(
                    'Guardado',
                    'El presupuesto ha sido actualizado.',
                    'success'
                );
                setShowSaveNotice(false);
            } catch (err) {
                console.error("Error al guardar los cambios: ", err);
                setError("Error al guardar los cambios.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGenerarPDF = () => {
        if (presupuesto) {
            GenerarPDF(presupuesto);
        }
    };

    const handleGenerarWord = () => {
        if (presupuesto) {
            GenerarWord(presupuesto);
        }
    };
    const agregarComponenteURL = async () => {
        if (url.trim() === '') {
            Swal.fire(
                'Advertencia',
                'Por favor, ingrese una URL válida.',
                'warning'
            );
            return;
        }

        try {
            setIsLoading(true); // Mostrar indicador de carga si es necesario

            // Guardar la URL en el documento actual en la colección 'proyectos'
            const docRef = doc(db, 'proyectos', id);

            await updateDoc(docRef, {
                url: url,
                timestamp: new Date(),
            });

            Swal.fire(
                'Guardado',
                'La URL ha sido añadida correctamente.',
                'success'
            );
        } catch (error) {
            console.error('Error al agregar la URL: ', error);
            Swal.fire(
                'Error',
                'Hubo un error al añadir la URL.',
                'error'
            );
        } finally {
            setIsLoading(false); // Ocultar indicador de carga si es necesario
        }
    };

    const agregarComponenteAclaracion = async () => {
        try {
            setIsLoading(true); // Mostrar indicador de carga si es necesario

            // Guardar la aclaración en el documento actual en la colección 'proyectos'
            const docRef = doc(db, 'proyectos', id);

            await updateDoc(docRef, {
                aclaracion: aclaracion,
                timestamp: new Date(),
            });

            Swal.fire(
                'Guardado',
                'La aclaración ha sido añadida correctamente.',
                'success'
            );

        } catch (error) {
            console.error('Error al agregar la aclaración: ', error);
            Swal.fire(
                'Error',
                'Hubo un error al añadir la aclaración.',
                'error'
            );
        } finally {
            setIsLoading(false); // Ocultar indicador de carga si es necesario
        }
    };

    const agregarMetodoPago = async () => {
        if (!metodoPago) {
            Swal.fire(
                'Advertencia',
                'Por favor ingrese un método de pago.',
                'warning'
            );
            return;
        }

        try {
            setIsLoading(true); // Mostrar indicador de carga si es necesario

            // Guardar el método de pago en el documento actual en la colección 'proyectos'
            const docRef = doc(db, 'proyectos', id);

            await updateDoc(docRef, {
                metodoPago: metodoPago, // Añadir el método de pago en el documento
                timestamp: new Date(),
            });

            Swal.fire(
                'Guardado',
                'El método de pago ha sido añadido correctamente.',
                'success'
            );

            setMetodoPago(''); // Limpiar el campo de entrada si es necesario
        } catch (error) {
            console.error('Error añadiendo el método de pago: ', error);
            Swal.fire(
                'Error',
                'Hubo un error al añadir el método de pago.',
                'error'
            );
        } finally {
            setIsLoading(false); // Ocultar indicador de carga si es necesario
        }
    };

    const agregarImpuesto = async () => {
        const porcentajeNumerico = parseFloat(nuevoImpuesto.porcentaje) || 0;
        const nuevoImpuestoConPorcentaje = {
            ...nuevoImpuesto,
            porcentaje: porcentajeNumerico
        };

        try {
            setIsLoading(true);
            const updatedImpuestos = [...impuestos, nuevoImpuestoConPorcentaje];
            const updatedTotal = calcularTotal(presupuesto.componentes, updatedImpuestos);

            await updateDoc(doc(db, "proyectos", id), {
                impuestos: updatedImpuestos,
                total: updatedTotal
            });

            setImpuestos(updatedImpuestos);
            setPresupuesto({
                ...presupuesto,
                total: updatedTotal
            });

            setNuevoImpuesto({ nombre: '', porcentaje: '' });
            setAlertMessage('Impuesto agregado correctamente.');
        } catch (err) {
            console.error("Error al agregar el impuesto: ", err);
            setError("Error al agregar el impuesto.");
        } finally {
            setIsLoading(false);
        }
    };

    const eliminarImpuesto = async (index) => {
        try {
            setIsLoading(true);
            const updatedImpuestos = impuestos.filter((_, i) => i !== index);
            const updatedTotal = calcularTotal(presupuesto.componentes, updatedImpuestos);

            await updateDoc(doc(db, "proyectos", id), {
                impuestos: updatedImpuestos,
                total: updatedTotal
            });

            setImpuestos(updatedImpuestos);
            setPresupuesto({
                ...presupuesto,
                total: updatedTotal
            });
        } catch (err) {
            console.error("Error al eliminar el impuesto: ", err);
            setError("Error al eliminar el impuesto.");
        } finally {
            setIsLoading(false);
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
                {isLoading && <Spinner animation="border" variant="primary" />}
                {alertMessage && <Alert variant="success">{alertMessage}</Alert>}
                {showSaveNotice && <Alert variant="warning">Se han modificado componentes, no olvide guardar los cambios.</Alert>}

                {presupuesto ? (
                    <div>
                        <div className={styles.tituloDescripcion}>
                            <p className={styles.tituloDescripcionText}><strong>Nombre del Proyecto:</strong> <span className={styles.tituloDescripcion}>{presupuesto.nombre}</span></p>
                            <p className={styles.tituloDescripcionText}><strong>Descripción:</strong>  <span className={styles.tituloDescripcion}>{presupuesto.descripcion}</span></p>
                        </div>
                        <Form.Group as={Row} className={styles.formEstado}>
                            <Form.Label column sm="4" className={styles.formLabel}><strong className={styles.tituloDescripcionText}>Estado del Presupuesto:</strong></Form.Label>
                            <Col sm="6">
                                <Form.Select
                                    value={estadoPresupuesto}
                                    onChange={handleEstadoChange}
                                    title="estado">
                                    <option value="cotizado">Cotizado</option>
                                    <option value="en Proceso">En Proceso</option>
                                    <option value="pagado">Pagado</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <h5>Componentes:</h5>
                        {presupuesto.componentes.map((componente, index) => (
                            <Form.Group as={Row} key={index} className={styles.formEstado}>
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
                                <Col sm="4">
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
                                <Col sm="2">
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
                                        title="Eliminar"
                                        className={styles.deletIcon}
                                        onClick={() => eliminarComponente(index)}
                                    />
                                </Col>
                            </Form.Group>
                        ))}

                        <p><strong>Subtotal:</strong> ${presupuesto.componentes.reduce((total, comp) => {
                            const precio = parseInt(comp.precio, 10) || 0;
                            const cantidad = parseInt(comp.cantidad, 10) || 1;
                            return total + (precio * cantidad);
                        }, 0)}</p>

                        <h5>Añadir Componente</h5>
                        <Form.Group as={Row}  className={styles.formEstado}>
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
                            <Col sm="2">
                                <Form.Control
                                    type="number"
                                    placeholder="Cantidad"
                                    name="cantidad"
                                    value={nuevoComponente.cantidad}
                                    onChange={(e) => setNuevoComponente({ ...nuevoComponente, cantidad: parseInt(e.target.value, 10) || 1 })}
                                    min={1}
                                    max={10}
                                />
                            </Col>
                            <Form.Group>
                                <Col sm="15" className={styles.btnAdd}>
                                    <Button variant="success" onClick={agregarComponente} title="Añadir" className={styles.botonGenerar}>Añadir</Button>
                                </Col>
                            </Form.Group>
                        </Form.Group>

                        <h5>Otros Componentes</h5>
                        <Form.Group as={Row} className={styles.formEstado}>
                            <Form.Label column sm="2">
                                <strong className={styles.tituloDescripcionText}>Url:</strong>
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="url"
                                    placeholder="https://ejemplo.com"
                                    pattern="https://.*"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Asegúrese de que la URL comience con "https://".
                                </Form.Text>
                            </Col>
                            <Col sm="2">
                                <Button
                                    variant="success"
                                    onClick={agregarComponenteURL}
                                    title="Añadir"
                                    className={styles.botonGenerar}
                                >
                                    <MdAdd className={styles.iconAdd} />
                                </Button>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={styles.formEstado}>
                            <Form.Label column sm="2">
                                <strong className={styles.tituloDescripcionText}>Aclaracion:</strong>
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    name="aclaraiones"
                                    placeholder="Aclaraiones..."
                                    value={aclaracion}
                                    onChange={(e) => setAclaracion(e.target.value)}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Ingrese Aqui si desea realizar alguna "aclaración" o "comentario".
                                </Form.Text>
                            </Col>
                            <Col sm="2">
                                <Button
                                    variant="success"
                                    onClick={agregarComponenteAclaracion}
                                    title="Añadir"
                                    className={styles.botonGenerar}
                                >
                                    <MdAdd className={styles.iconAdd} />
                                </Button>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={styles.formEstado}>
                            <Form.Label column sm="2">
                                <strong className={styles.tituloDescripcionText}>Método de Pago:</strong>
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    name="metodoPago"
                                    placeholder="Método de pago..."
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Ingrese aquí el método de pago que se utilizará.
                                </Form.Text>
                            </Col>
                            <Col sm="2">
                                <Button
                                    variant="success"
                                    onClick={agregarMetodoPago}
                                    title="Añadir"
                                    className={styles.botonGenerar}
                                >
                                    <MdAdd className={styles.iconAdd} />
                                </Button>
                            </Col>
                        </Form.Group>
                        {/* Formulario para agregar nuevo impuesto */}
                        <h4>Agregar Impuesto:</h4>
                        <Form.Group as={Row} className={styles.formEstado}>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del Impuesto"
                                    name="nombre"
                                    value={nuevoImpuesto.nombre}
                                    onChange={(e) =>
                                        setNuevoImpuesto({ ...nuevoImpuesto, nombre: e.target.value })
                                    }
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Porcentaje"
                                    name="porcentaje"
                                    value={nuevoImpuesto.porcentaje}
                                    onChange={(e) =>
                                        setNuevoImpuesto({ ...nuevoImpuesto, porcentaje: e.target.value })
                                    }
                                />
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={agregarImpuesto}>
                                    Agregar
                                </Button>
                            </Col>
                        </Form.Group>

                        {/* Mostrar impuestos */}
                        <h4 className={styles.inpuestoTitulo}>Impuestos:</h4>
                        {impuestos.length > 0 ? (
                            impuestos.map((imp, index) => (
                                <Form.Group as={Row} className={styles.formEstado} key={index} >
                                    <Col sm="6">
                                        <Form.Control
                                            as="textarea"
                                            rows={1}
                                            placeholder="Nombre del Impuesto"
                                            value={imp.nombre}
                                            readOnly
                                        />
                                    </Col>
                                    <Col sm="3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Porcentaje"
                                            value={`${imp.porcentaje}%`}
                                            readOnly
                                        />
                                    </Col>
                                    <Col sm="2">
                                        <FaDeleteLeft
                                            title="Eliminar"
                                            className={styles.deletIcon}
                                            onClick={() => eliminarImpuesto(index)}
                                        />
                                    </Col>
                                </Form.Group>
                            ))
                        ) : (
                            <p>No hay impuestos agregados.</p>
                        )}
                        <h5></h5>
                        <p className={styles.total}><strong>Total:</strong> ${presupuesto.total}</p>
                        <div className={styles.botones}>
                            {showSaveNotice && (
                                <Button variant="success" onClick={guardarCambios} className={styles.botonGenerar} title="Guardar Cambios">Guardar Cambios</Button>
                            )}
                            <Button variant="primary" onClick={handleGenerarPDF} className={styles.botonGenerar} title="Generar PDF">Generar PDF</Button>
                            <Button variant="primary" onClick={handleGenerarWord} className={styles.botonGenerar} title="Generar Word">Generar Word</Button>
                        </div>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>
        </>
    );
}

export default DPresupuesto;