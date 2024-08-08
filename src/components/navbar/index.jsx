import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from "./navbar.module.css"
function ColorSchemesExample() {
  return (
    <>
    <div>
        <Navbar bg="dark" data-bs-theme="dark" className={Styles.navbar}>
            <Container>
            <Navbar.Brand href="#home">
                <img src="/icon.png" className={Styles.imgIcon}></img>
            </Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/">Inicio</Nav.Link>
                <Nav.Link href="/Presupuestos">Presupuestos</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    </div>
    </>
  );
}

export default ColorSchemesExample;