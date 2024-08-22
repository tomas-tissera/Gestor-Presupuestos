import React from 'react';
import { Col } from 'react-bootstrap';
import { FaDeleteLeft } from 'react-icons/fa6';
import styles from "./detallePresupuesto.module.css";

const ComponenteEliminar = ({ eliminarComponente, index }) => (
    <Col sm="1">
        <FaDeleteLeft
            title="Eliminar"
            className={styles.deletIcon}
            onClick={() => eliminarComponente(index)}
        />
    </Col>
);

export default ComponenteEliminar;
