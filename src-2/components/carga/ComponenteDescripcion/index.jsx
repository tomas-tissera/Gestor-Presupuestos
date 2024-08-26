import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ComponenteDescripcion = ({ descripcion, handleInputChange, index }) => (
    <Form.Group as={Row} className="mb-3">
        <Col sm="4">
            <Form.Control
                as="textarea"
                rows={1}
                placeholder="Descripción"
                name="descripcion"
                value={descripcion}
                onChange={(e) => handleInputChange(index, e)}
            />
        </Col>
    </Form.Group>
);

export default ComponenteDescripcion;
