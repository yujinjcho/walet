import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

import api from './api';

import './Login.css';

function Login() {
  const [authRedirectUrl, setAuthRedirectUrl] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.fetchHelper('/api/auth/login')
        .then(res => res.json())
        .then(res => res.result)
        .catch(_ => {
          console.error('failed to retrieve authentication url');
          return undefined;
        })

      setAuthRedirectUrl(result);
    };

    fetchData();
  }, []);

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

export default Login;
