import React from 'react';
import Container from 'react-bootstrap/Container'
import LandingPageNavigation from './LandingPageNavigation';

const Contact = (props) => {

  return (
    <>
      <LandingPageNavigation authUrl={props.authUrl} />
      <Container>
        <h2>
          Contact
        </h2>
      </Container>
    </>
  );
}

export default Contact;
