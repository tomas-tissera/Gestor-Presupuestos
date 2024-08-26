import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { FaDeleteLeft } from 'react-icons/fa6';
import { MdOutlinePlaylistAdd, MdOutlineExpandMore } from 'react-icons/md';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { db } from '../../firebase'; // Asegúrate de ajustar la ruta si es necesario
import { collection, addDoc } from 'firebase/firestore';
import styles from './cPresupuesto.module.css';
import NavBar from "../navbar/index"
const CrearPresupuesto = () => {
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [descripcionProyecto, setDescripcionProyecto] = useState('');
    const [estadoPresupuesto, setEstadoPresupuesto] = useState('cotizado'); // Estado inicial
    const [componentes, setComponentes] = useState([{ nombre: '', descripcion: '', precio: 0, cantidad: 0, subcomponentes: [] }]);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const agregarComponente = () => {
        setComponentes([...componentes, { nombre: '', descripcion: '', precio: 0, cantidad: 0, subcomponentes: [] }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const nuevosComponentes = [...componentes];

        if (name === 'precio') {
            const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
            nuevosComponentes[index][name] = numericValue;
        } else {
            nuevosComponentes[index][name] = value;
        }

        setComponentes(nuevosComponentes);
    };

    const handleCantidadChange = (index, event) => {
        const { value } = event.target;
        const nuevosComponentes = [...componentes];
        nuevosComponentes[index].cantidad = parseInt(value, 10) || 0;
        setComponentes(nuevosComponentes);
    };

  

    const handleSubcomponenteChange = (indexComponente, indexSubcomponente, event) => {
        const { name, value } = event.target;
        const nuevosComponentes = [...componentes];

        if (name === 'precio') {
            const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
            nuevosComponentes[indexComponente].subcomponentes[indexSubcomponente][name] = numericValue;
        } else {
            nuevosComponentes[indexComponente].subcomponentes[indexSubcomponente][name] = value;
        }

        setComponentes(nuevosComponentes);
    };

    const handleCantidadSubcomponenteChange = (indexComponente, indexSubcomponente, event) => {
        const { value } = event.target;
        const nuevosComponentes = [...componentes];
        nuevosComponentes[indexComponente].subcomponentes[indexSubcomponente].cantidad = parseInt(value, 10) || 0;
        setComponentes(nuevosComponentes);
    };

    const calcularPrecioComponente = (componente) => {
        return componente.subcomponentes.reduce((total, subcomponente) => {
            const precio = subcomponente.precio || 0;
            return total + precio * (subcomponente.cantidad || 0);
        }, 0);
    };

    const calcularTotalGeneral = () => {
        return componentes.reduce((total, componente) => {
            const precioComponente = componente.subcomponentes.length > 0
                ? calcularPrecioComponente(componente)
                : componente.precio || 0;
            const totalComponente = precioComponente * (componente.cantidad || 0);
            return total + totalComponente;
        }, 0);
    };

    const eliminarComponente = (index) => {
        const nuevosComponentes = componentes.filter((_, i) => i !== index);
        setComponentes(nuevosComponentes);
    };

    const eliminarSubcomponente = (indexComponente, indexSubcomponente) => {
        const nuevosComponentes = [...componentes];
        nuevosComponentes[indexComponente].subcomponentes = nuevosComponentes[indexComponente].subcomponentes.filter((_, i) => i !== indexSubcomponente);
        setComponentes(nuevosComponentes);
    };

    const guardarPresupuesto = async (e) => {
        e.preventDefault();

        // Validar que todos los componentes tengan nombre, precio y cantidad
        for (const componente of componentes) {
            if (!componente.nombre || componente.precio === 0 || !componente.cantidad) {
                alert("Todos los campos del componente son obligatorios.");
                return;
            }

            // Validar que todos los subcomponentes tengan nombre, precio y cantidad
            for (const subcomponente of componente.subcomponentes) {
                if (!subcomponente.nombre || subcomponente.precio === 0 || !subcomponente.cantidad) {
                    alert("Todos los campos del subcomponente son obligatorios.");
                    return;
                }
            }
        }

        setLoading(true);

        const proyecto = {
            nombre: nombreProyecto,
            descripcion: descripcionProyecto,
            componentes: componentes,
            total: calcularTotalGeneral(),
            estado: estadoPresupuesto, // Incluir el estado del presupuesto
        };

        try {
            await addDoc(collection(db, "proyectos"), proyecto);
            setLoading(false);
            setShowAlert(true);

            setNombreProyecto('');
            setDescripcionProyecto('');
            setComponentes([{ nombre: '', descripcion: '', precio: 0, cantidad: 0, subcomponentes: [] }]);

            setTimeout(() => setShowAlert(false), 3000);
        } catch (e) {
            setLoading(false);
            console.error("Error al guardar el presupuesto: ", e);
        }
    };

    return (
        <div>
            <NavBar/>
            <div className={styles.fomrulario}>
                {loading && (
                    <div className={styles.loadingContainer}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </Spinner>
                    </div>
                )}
                {showAlert && (
                    <Alert variant="success" className={styles.alert}>
                        Presupuesto generado con éxito.
                    </Alert>
                )}
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Nombre del Proyecto</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre del Proyecto"
                            value={nombreProyecto}
                            onChange={(e) => setNombreProyecto(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Descripcion:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Descripcion"
                            value={descripcionProyecto}
                            onChange={(e) => setDescripcionProyecto(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Label column sm="2" className={styles.textLeft}>
                        <p className={styles.textLeft}>
                            Componentes
                        </p>
                    </Form.Label>
                    {componentes.map((componente, index) => (
                        <div key={index} className={styles.componenteContainer}>
                            <Form.Group as={Row} className="mb-3">
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
                                        placeholder="Descripcion"
                                        name="descripcion"
                                        value={componente.descripcion}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </Col>
                                <Col sm="2">
                                    < Form.Control
                                        type="number"
                                        placeholder="Precio"
                                        name="precio"
                                        value={componente.subcomponentes.length > 0 ? calcularPrecioComponente(componente) : componente.precio}
                                        onChange={(e) => handleInputChange(index, e)}
                                        readOnly={componente.subcomponentes.length > 0} // Hacer solo lectura si tiene subcomponentes
                                    />
                                </Col> 
                                <Col sm="1">
                                    <Form.Control
                                        type="number"
                                        placeholder="Cantidad"
                                        name="cantidad"
                                        value={componente.cantidad}
                                        onChange={(e) => handleCantidadChange(index, e)}
                                        min={-10}
                                        max={100}
                                    />
                                </Col>
                                <Col sm="1">
                                    <FaDeleteLeft
                                        className={styles.deletIcon}
                                        onClick={() => eliminarComponente(index)}
                                    />
                                </Col>
                            </Form.Group>
                           
                        </div>
                    ))}
                    <div className={styles.iconContainer}>
                        <hr className={styles.divider} />
                        <a onClick={agregarComponente} className={styles.iconLink}>
                            <MdOutlinePlaylistAdd className={styles.icono} />
                        </a>
                    </div>
                    <Form.Group as={Row} className="mb-3">
                        <Col sm="12" className="text-right">
                            <strong>Total General: ${calcularTotalGeneral()}</strong>
                        </Col>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button
                            variant="primary"
                            size="lg"
                            type="submit"
                            onClick={guardarPresupuesto}
                            disabled={calcularTotalGeneral() === 0}  // Deshabilitar si el total es 0
                        >
                            Generar Presupuesto
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CrearPresupuesto;
