import React from 'react';
import Container from 'react-bootstrap/Container'
import LandingPageNavigation from './LandingPageNavigation';

import './HowItWorks.css';

const demoVideo = (url) => (
  <div className='demo-section'>
    <iframe
      title="demo"
      width="840"
      height="473"
      src={url}
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  </div>
)

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
            Connect your accounts via Plaid Link
          </div>
          { demoVideo("https://www.youtube.com/embed/y9sEVtFGh7s") }

          <div className='how-it-works-description'>
            Your transactions are automatically retrieved
          </div>
          { demoVideo("https://www.youtube.com/embed/rUbTZ8OrwZY") }

          <div className='how-it-works-description'>
            Create new categories and category rules
          </div>
          { demoVideo("https://www.youtube.com/embed/qM7hpkePzpQ") }

          <div className='how-it-works-description'>
            Categorize all your transactions for the month in a few clicks
          </div>
          { demoVideo("https://www.youtube.com/embed/m6DFWzprzdQ") }

          <div className='how-it-works-description'>
            Hide any transactions you want to exclude and review your total spending by category
          </div>
          { demoVideo("https://www.youtube.com/embed/F5vMvfim0HA") }

        </div>


      </Container>
    </>
  );
}

export default HowItWorks;
