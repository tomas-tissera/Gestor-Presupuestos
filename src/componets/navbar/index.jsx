import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from "./navbar.module.css";
import { LuLogOut } from "react-icons/lu";
import { FaBars } from 'react-icons/fa'; // Importar ícono de menú

function ColorSchemesExample() {
  const navigate = useNavigate();

  const logoutUser = async (e) => {
    e.preventDefault();
    // Agregar lógica de cierre de sesión aquí
    navigate('/');
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className={Styles.navbar2}>
      <Container className={Styles.navbar}>
        <Navbar.Brand href="#home">
          <img src="/icon.png" className={Styles.imgIcon} alt="Icon" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className={Styles.navbarToggle}>
          <FaBars color="white" size={20} />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/home"
              className={({ isActive }) => isActive ? Styles.activeLink : Styles.link}
            >
              Presupuestos
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/crear"
              className={({ isActive }) => isActive ? Styles.activeLink : Styles.link}
            >
              Crear Presupuesto
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/info"
              className={({ isActive }) => isActive ? Styles.activeLink : Styles.link}
            >
              Información
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={logoutUser}>
              <LuLogOut size={20} color="white" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;
