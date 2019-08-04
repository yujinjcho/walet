import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './Navigation.css';

class Navigation extends Component {

  homeHandler = () => this.props.history.push('/');

  logoutHandler = () => this.props.history.push('/logout');

  accountHandler = () => this.props.history.push('/account')

  render() {
    return (

      <Navbar className='walet-navbar' collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#" onClick={ this.homeHandler } >
          Simplified
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav>
            <Nav.Link onClick={ this.accountHandler }>
              Account
            </Nav.Link>
            <Nav.Link className='logout' onClick={ this.logoutHandler }>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

    );
  }
}

export default withRouter(Navigation);
