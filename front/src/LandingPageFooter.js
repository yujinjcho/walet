import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import './LandingPageFooter.css'

const LandingPageFooter = (props) => {

  return (
    <div className='landing-page-footer-container'>

      <Row className='links'>
        <Col xs={3}></Col>

        <Col xs={2}>
          How it works
        </Col>
        |
        <Col xs={2}>
          Contact
        </Col>
        |
        <Col xs={2}>
          About
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

export default LandingPageFooter;
