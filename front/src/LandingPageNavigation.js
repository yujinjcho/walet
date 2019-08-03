import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './LandingPageNavigation.css';


class LandingPageNavigation extends Component {

  redirectTo = (path) => () => this.props.history.push(path)

  render() {

    return (

      <Navbar className='landing-page-navbar' collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand className='logo' href="#" onClick={ this.redirectTo('/') } >
          Simplified
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>
            <Nav.Link className='landing-page-links' onClick={ this.redirectTo('/how-it-works') }>
              How it Works
            </Nav.Link>
            <Nav.Link className='landing-page-links' onClick={ this.redirectTo('/contact') }>
              Contact
            </Nav.Link>
            <Nav.Link className='landing-page-links' onClick={ this.redirectTo('/about') }>
              About
            </Nav.Link>

            <Nav.Link href={this.props.authUrl} className='landing-page-links'>
              Sign In
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(LandingPageNavigation);
