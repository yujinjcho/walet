import React from 'react';
import Container from 'react-bootstrap/Container'
import LandingPageNavigation from './LandingPageNavigation';

import './HowItWorks.css';

const HowItWorks = (props) => {

  return (
    <>
      <LandingPageNavigation authUrl={props.authUrl} />
      <Container>

        <div className='how-it-works-container'>
          <div className='how-it-works-header'>
            How It Works
          </div>

          <div className='how-it-works-description'>
            Demonstration of how to use the tool
          </div>

          <div className='demo-section'>
            <iframe
              title="demo"
              width="840"
              height="473"
              src="https://www.youtube.com/embed/u0HqAUpeWbU"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>

        </div>


      </Container>
    </>
  );
}

export default HowItWorks;
