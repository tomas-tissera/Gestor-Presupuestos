import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './InfoPage.module.css';
import Navbar from "../../componets/navbar/index"
function InfoPage() {
  const libraries = [
    { name: 'React', description: 'Biblioteca para construir interfaces de usuario' },
    { name: 'React Bootstrap', description: 'Componentes de Bootstrap para React' },
    { name: 'Firebase', description: 'Plataforma para desarrollo web y móvil' },
    { name: 'React Router', description: 'Librería para manejar rutas en aplicaciones React' }
  ];

  const creatorInfo = {
    name: 'Tomás Tissera',
    email: 'tomas.tissera.trabajo@gmail.com',
    linkedin: 'https://www.linkedin.com/in/tom%C3%A1s-tissera-340b471a8/'
  };

  return (
    <>
        <Navbar></Navbar>
        <Container className={styles.container}>
            <h2 className={styles.heading}>Información de la Página</h2>
            <Row className={styles.row}>
                <Col md={6}>
                <div className={styles.section}>
                    <h4 className={styles.title}>Librerías Usadas</h4>
                    <ul className={styles.list}>
                    {libraries.map((lib, index) => (
                        <li key={index} className={styles.listItem}>
                        <strong>{lib.name}:</strong> {lib.description}
                        </li>
                    ))}
                    </ul>
                </div>
                </Col>
                <Col md={6}>
                <div className={styles.section}>
                    <h4 className={styles.title}>Creador</h4>
                    <p><strong>Nombre:</strong> {creatorInfo.name}</p>
                    <p><strong>Email:</strong> <a href={`mailto:${creatorInfo.email}`}>{creatorInfo.email}</a></p>
                    <p><strong>LinkedIn:</strong> <a href={creatorInfo.linkedin} target="_blank" rel="noopener noreferrer">Perfil de LinkedIn</a></p>
                </div>
                </Col>
            </Row>
            <footer className={styles.footer}>
                <p>© 2024 - Todos los derechos reservados.</p>
            </footer>
        </Container>
    </>
  );
}

export default InfoPage;
