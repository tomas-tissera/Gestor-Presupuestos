import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ComponenteNombre = ({ nombre, handleInputChange, index }) => (
    <Form.Group as={Row} className="mb-3">
        <Col sm="3">
            <Form.Control
                as="textarea"
                rows={1}
                placeholder="Nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => handleInputChange(index, e)}
            />
        </Col>
    </Form.Group>
);

export default ComponenteNombre;
