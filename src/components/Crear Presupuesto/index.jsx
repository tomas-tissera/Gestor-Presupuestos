import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import styles from "./cPresupuesto.module.css";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdOutlineExpandMore } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";


const CrearPresupuesto = () => {
    const [componentes, setComponentes] = useState([{ nombre: '', precio: '', subcomponentes: [] }]);

    const agregarComponente = () => {
        setComponentes([...componentes, { nombre: '', precio: '', subcomponentes: [] }]);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const nuevosComponentes = [...componentes];

        if (name === 'precio') {
            const formattedValue = formatCurrency(value);
            nuevosComponentes[index][name] = formattedValue;
        } else {
            nuevosComponentes[index][name] = value;
        }

        setComponentes(nuevosComponentes);
    };

    const agregarSubcomponente = (indexComponente) => {
        const nuevosComponentes = [...componentes];
        nuevosComponentes[indexComponente].subcomponentes.push({ nombre: '', precio: '' });
        setComponentes(nuevosComponentes);
    };

    const handleSubcomponenteChange = (indexComponente, indexSubcomponente, event) => {
        const { name, value } = event.target;
        const nuevosComponentes = [...componentes];

        if (name === 'precio') {
            const formattedValue = formatCurrency(value);
            nuevosComponentes[indexComponente].subcomponentes[indexSubcomponente][name] = formattedValue;
        } else {
            nuevosComponentes[indexComponente].subcomponentes[indexSubcomponente][name] = value;
        }

        setComponentes(nuevosComponentes);
    };

    const formatCurrency = (value) => {
        const number = value.replace(/[^0-9.]/g, ''); // Remover todo menos números y punto decimal
        return `$${number}`;
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
    return (
        <div>
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
                        <div key={index} className={styles.componenteContainer}>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="2">
                                    Componente
                                </Form.Label>
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
                                <Col sm="2">
                                    <Form.Control
                                        type="text"  // Cambiado de "number" a "text"
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

                            <div className={styles.subcomponentesContainer}>
                                {componente.subcomponentes.map((subcomponente, subIndex) => (
                                    <div key={subIndex} className={styles.subcomponente}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="2" className={styles.subcomponenteLabel}>
                                                Subcomponente
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={1}
                                                    placeholder="Nombre"
                                                    name="nombre"
                                                    value={subcomponente.nombre}
                                                    onChange={(e) => handleSubcomponenteChange(index, subIndex, e)}
                                                />
                                            </Col>
                                            <Col sm="2">
                                                <Form.Control
                                                    type="text"  // Cambiado de "number" a "text"
                                                    placeholder="Precio"
                                                    name="precio"
                                                    value={subcomponente.precio}
                                                    onChange={(e) => handleSubcomponenteChange(index, subIndex, e)}
                                                />
                                            </Col>
                                            <Col sm="1">
                                                <RiDeleteBin5Fill  
                                                    className={styles.deletIcon} 
                                                    onClick={() => eliminarSubcomponente(index, subIndex)} 
                                                />
                                            </Col>
                                        </Form.Group>
                                    </div>
                                ))}
                                <div className={styles.iconContainer}>
                                    <a onClick={() => agregarSubcomponente(index)} className={styles.iconLink}>
                                        <MdOutlineExpandMore className={styles.icono} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className={styles.iconContainer}>
                        <hr className={styles.divider}/>
                        <a onClick={agregarComponente} className={styles.iconLink}>
                            <MdOutlinePlaylistAdd className={styles.icono} />
                        </a>
                    </div>
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" type="submit">
                            Generar Presupuesto
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CrearPresupuesto;
