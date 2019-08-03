import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './LandingPageNavigation.css';


class LandingPageNavigation extends Component {

  homeHandler = () => this.props.history.push('/');

  logoutHandler = () => this.props.history.push('/logout');

  accountHandler = () => this.props.history.push('/account')

  render() {
    return (

      <Navbar className='landing-page-navbar' collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand className='logo' href="#" onClick={ this.homeHandler } >
          Simplified
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>
            <Nav.Link className='landing-page-links' onClick={ this.accountHandler }>
              How it Works
            </Nav.Link>
            <Nav.Link className='landing-page-links' onClick={ this.accountHandler }>
              Contact
            </Nav.Link>
            <Nav.Link className='landing-page-links' onClick={ this.logoutHandler }>
              About
            </Nav.Link>
            <Nav.Link className='landing-page-links' onClick={ this.logoutHandler }>
              Sign In
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(LandingPageNavigation);
