import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { withRouter } from 'react-router-dom';

import './LandingPageFooter.css'

const redirectTo = (props, path) => () => props.history.push(path)

const LandingPageFooter = (props) => {


  return (
    <div className='landing-page-footer-container'>

      <Row className='links'>
        <Col xs={3}></Col>

        <Col xs={2} onClick={ redirectTo(props, '/how-it-works') }>
          <div className='footer-link' onClick={ redirectTo(props, '/how-it-works') }>
            How it works
          </div>
        </Col>
        |
        <Col xs={2}>
          <div className='footer-link' onClick={ redirectTo(props, '/contact') }>
            Contact
          </div>
        </Col>
        |
        <Col xs={2}>
          <div className='footer-link' onClick={ redirectTo(props, '/about') }>
            About
          </div>
        </Col>

        <Col xs={3}></Col>
      </Row>

      <Row>
        <div className='footer-company-name'>
          © 2019 Simplified
        </div>
      </Row>

    </div>
  );
}

export default withRouter(LandingPageFooter);
