import React from 'react';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from "./navbar.module.css";

function ColorSchemesExample() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className={Styles.navbar}>
        <Container>
          <Navbar.Brand href="#home">
            <img src="/icon.png" className={Styles.imgIcon} alt="Icon" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              className={({ isActive }) => isActive ? Styles.activeLink : Styles.link}
            >
              Presupuestos
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/Presupuestos" 
              className={({ isActive }) => isActive ? Styles.activeLink : Styles.link}
            >
              Crear Presupuesto
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/Info" 
              className={({ isActive }) => isActive ? Styles.activeLink : Styles.link}
            >
              Informacion
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
