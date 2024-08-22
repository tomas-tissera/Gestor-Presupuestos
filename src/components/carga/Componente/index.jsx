import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaDeleteLeft } from 'react-icons/fa6';
import styles from "./detallePresupuesto.module.css";

const Componente = ({ componente, index, handleInputChange, handleCantidadChange, eliminarComponente }) => (
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
);

export default Componente;
