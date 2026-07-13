import { Navbar, Nav, Container } from "react-bootstrap";

// Link finti: servono solo a riempire la navbar, non portano da nessuna parte
const LINKS = ["Home", "Attività", "Archivio", "Impostazioni"];

function NavBar() {
  return (
    <Navbar expand="lg" variant="dark" className="bg-dark border-bottom border-secondary">
      <Container>
        <Navbar.Brand href="#">ToDo List</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          {/* me-auto spinge il blocco utente tutto a destra */}
          <Nav className="me-auto">
            {LINKS.map((link) => (
              <Nav.Link key={link} href="#">
                {link}
              </Nav.Link>
            ))}
          </Nav>

          {/* Utente finto: nessun login, nessun menu, solo avatar con iniziali */}
          <div className="d-flex align-items-center gap-2 text-white">
            <span className="d-none d-lg-inline small">Gabriele</span>
            <span className="user-avatar" aria-hidden="true">
              GL
            </span>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
