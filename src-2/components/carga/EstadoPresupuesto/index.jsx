import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const EstadoPresupuesto = ({ estadoPresupuesto, handleEstadoChange }) => (
    <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="4">
            <strong>Estado del Presupuesto:</strong>
        </Form.Label>
        <Col sm="6">
            <Form.Select
                value={estadoPresupuesto}
                onChange={handleEstadoChange}
                title="estado"
            >
                <option value="cotizado">Cotizado</option>
                <option value="en Proceso">En Proceso</option>
                <option value="pagado">Pagado</option>
            </Form.Select>
        </Col>
    </Form.Group>
);

export default EstadoPresupuesto;
