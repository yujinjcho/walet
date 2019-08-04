import React from 'react';
import Container from 'react-bootstrap/Container'
import LandingPageNavigation from './LandingPageNavigation';

const About = (props) => {
  return (
    <>
      <LandingPageNavigation authUrl={props.authUrl} />
      <Container>
        <h2>
          About
        </h2>
      </Container>
    </>
  );
}

export default About;
