import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ComponenteCantidad = ({ cantidad, handleCantidadChange, index }) => (
    <Form.Group as={Row} className="mb-3">
        <Col sm="2">
            <Form.Control
                type="number"
                placeholder="Cantidad"
                name="cantidad"
                value={cantidad}
                onChange={(e) => handleCantidadChange(index, e)}
                min={1}
                max={10}
            />
        </Col>
    </Form.Group>
);

export default ComponenteCantidad;
