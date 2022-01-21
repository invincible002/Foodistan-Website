import { Navbar, Container, Button, Nav, Row, Col, Form, FormControl, Badge } from "react-bootstrap";
import React from "react";
import logo from "../../images/logo.jpg";
import { Link } from "react-router-dom";


function Header(){
    return(
        <div>   <Navbar bg="white" expand="sm"  className="navbar">
        <Container >
          <Navbar.Brand className="navbar-brand "><Link to="/"><img src={logo} className="logo"></img></Link></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="ml-auto">
              <Nav.Item className="mx-4"><Nav.Link><a href="#login">About Us</a></Nav.Link></Nav.Item>
              <Nav.Item className="mx-4"><Nav.Link> <Link to="/Blogs">Blogs </Link></Nav.Link></Nav.Item>
              <Nav.Item className="mx-4"><Nav.Link><a href="#login">Become our patner</a></Nav.Link></Nav.Item>
              <Nav.Item className="mx-4"><Nav.Link><Link to="/login"><Button type="button"className="btn"variant="warning" size="lg">Login/Sign Up</Button></Link>{' '}</Nav.Link></Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
    )

    
}
export default Header;