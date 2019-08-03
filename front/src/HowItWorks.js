import React from 'react';
import Container from 'react-bootstrap/Container'
import LandingPageNavigation from './LandingPageNavigation';

const HowItWorks = (props) => {

  return (
    <>
      <LandingPageNavigation authUrl={props.authUrl} />
      <Container>
        <h2>
          How it works
        </h2>
      </Container>
    </>
  );
}

export default HowItWorks;
