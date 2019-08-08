import React from 'react';
import Container from 'react-bootstrap/Container'
import LandingPageNavigation from './LandingPageNavigation';

import './About.css';

const About = (props) => {
  return (
    <>
      <LandingPageNavigation authUrl={props.authUrl} />
      <Container>
        <div className='about-container'>
          <div className='about-header'>
            Manage Your Finances
          </div>

          <div className='about-description'>
            Simplified is focused on making it easier to track your spending. It consolidates your accounts into one place and provide a simple interface for categorizing and customizing your transactions.
          </div>

          <div className='about-description'>
            With minimal effort, you will be able to see how much you’re spending as well as what type of things you’re spending the most on.
          </div>
        </div>

      </Container>
    </>
  );
}

export default About;
