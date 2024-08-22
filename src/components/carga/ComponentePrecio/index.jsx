import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ComponentePrecio = ({ precio, handleInputChange, index }) => (
    <Form.Group as={Row} className="mb-3">
        <Col sm="2">
            <Form.Control
                type="text"
                placeholder="Precio"
                name="precio"
                value={`$${precio}`}
                onChange={(e) => handleInputChange(index, e)}
            />
        </Col>
    </Form.Group>
);

export default ComponentePrecio;
