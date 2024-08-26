import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from "./navbar.module.css";
import { LuLogOut } from "react-icons/lu";

function ColorSchemesExample() {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle user logout
  const logoutUser = async (e) => {
    e.preventDefault(); // Prevent default anchor behavior if needed
    // Add your logout logic here (e.g., Firebase auth sign-out)
    // For now, let's assume a simple navigation to the login page after logout
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className={Styles.navbar2}>
        <Container className={Styles.navbar}>
          <Navbar.Brand href="#home">
            <img src="/icon.png" className={Styles.imgIcon} alt="Icon" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/profile"
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
              Informacion
            </Nav.Link>
          </Nav>
          {/* Logout Icon */}
          <Nav>
            <Nav.Link onClick={logoutUser}>
              <LuLogOut size={20} color="white" />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;
