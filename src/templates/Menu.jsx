import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export default function Menu(props) {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Menu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/usuario">Usuario</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Bate Papo" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/batepapogeral">Geral</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Visualizar Cadastros" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/usuarioExcluirAlterar">Usuario</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}