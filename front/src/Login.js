import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import api from './api';

import './Login.css';

class Login extends Component {

  state = {
    authRedirectUrl: undefined
  }

  componentDidMount() {
    api.fetchHelper('/api/auth/login')
      .then(res => res.json())
      .then(res => this.setState({ authRedirectUrl: res.result }))
      .catch(_ => console.error('failed to retrieve authentication url'))
  }

  render() {
    const { authRedirectUrl } = this.state;

    return (
      <div className='login-section'>
        <div className='login-logo'>
          Walet
        </div>
          { authRedirectUrl &&
            <a href={ authRedirectUrl }>
              <Button variant="primary" size="lg" block >
                Login
              </Button>
            </a>
          }
      </div>
    );
  }
}

export default Login;
