import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { MdAdd } from 'react-icons/md';
import styles from './MetodoPagoComponent.module.css'; // Asegúrate de que la ruta sea correcta
import { db } from '../../../firebase'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc } from 'firebase/firestore';
const MetodoPagoComponent = ({ agregarMetodoPago }) => {
    const [metodoPago, setMetodoPago] = useState('');

    const agregarMetodoPago = async () => {
        if (!metodoPago) {
            alert('Por favor ingrese un método de pago.');
            return;
        }

        try {
            await addDoc(collection(db, 'proyectos', presupuestoId, 'metodosDePago'), {
                metodo: metodoPago,
                fecha: new Date(),
            });
            alert('Método de pago añadido exitosamente.');
            setMetodoPago(''); // Limpiar el campo de entrada
        } catch (error) {
            console.error('Error añadiendo el método de pago: ', error);
            alert('Error añadiendo el método de pago.');
        }
    };

    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
                <strong className={styles.tituloDescripcionText}>Método de Pago:</strong>
            </Form.Label>
            <Col sm="8">
                <Form.Control
                    type="text"
                    name="metodoPago"
                    placeholder="Método de pago..."
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    required
                />
                <Form.Text className="text-muted">
                    Ingrese aquí el método de pago que se utilizará.
                </Form.Text>
            </Col>
            <Col sm="2">
                <Button
                    variant="success"
                    onClick={agregarMetodoPago}
                    title="Añadir"
                    className={styles.botonGenerar}
                >
                    <MdAdd className={styles.iconAdd} />
                </Button>
            </Col>
        </Form.Group>
    );
};

export default MetodoPagoComponent;