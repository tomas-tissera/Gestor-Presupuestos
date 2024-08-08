import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import styles from "./cPresupuesto.module.css";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import Button from 'react-bootstrap/Button';

const CrearPresupuesto = () => {
    const [componentes, setComponentes] = useState([{ nombre: '', precio: '' }]);

    const agregarComponente = () => {
        setComponentes([...componentes, { nombre: '', precio: '' }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const nuevosComponentes = [...componentes];
        nuevosComponentes[index][name] = value;
        setComponentes(nuevosComponentes);
    };

    const eliminarComponente = (index) => {
        const nuevosComponentes = componentes.filter((_, i) => i !== index);
        setComponentes(nuevosComponentes);
    };

    return (
        <div>
            <h4>Crear Presupuestos</h4>
            <div className={styles.fomrulario}>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Nombre del Proyecto</Form.Label>
                        <Form.Control type="text" placeholder="Nombre del Proyecto" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Descripcion:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Descripcion" />
                    </Form.Group>
                            <Form.Label column sm="2" className={styles.textLeft}>
                                <p className={styles.textLeft}>

                                    Componentes
                                </p>
                            </Form.Label>
                    {componentes.map((componente, index) => (
                        <Form.Group as={Row} className="mb-3" key={index}>
                            <Col sm="7">
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
                                    type="number"
                                    placeholder="Precio"
                                    name="precio"
                                    value={componente.precio}
                                    onChange={(e) => handleInputChange(index, e)}
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
                    <div className={styles.iconContainer}>
                        <hr className={styles.divider}/>
                        <a onClick={agregarComponente} className={styles.iconLink}>
                            <MdOutlinePlaylistAdd className={styles.icono} />
                        </a>
                    </div>
                </Form>
                <div className={`${styles.cargar} d-grid gap-2`} >
                    <Button variant="primary" size="lg">
                        Cargar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CrearPresupuesto;
