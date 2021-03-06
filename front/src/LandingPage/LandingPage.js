import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import LandingPageNavigation from './LandingPageNavigation';
import DescriptionBullet from './DescriptionBullet';
import DescriptionIcon from './DescriptionIcon';
import DemoSection from './DemoSection';

import './LandingPage.css';
import LandingPageFooter from './LandingPageFooter';

const LandingPage = (props) => {

  return (
    <>
      <LandingPageNavigation authUrl={props.authUrl} />
      <div className='landing-page-body'>
        <div className='main-section'>
          <div className='main-section-title'>
            spending
            <br/>
            <b>simplified</b>
          </div>
          <div className='main-section-description'>
            Get a clear view of your spending
          </div>
          <Button className='get-started'>
            <a className='get-started-button' href={props.authUrl || '/'}>
              Get Started
            </a>
          </Button>
        </div>
        <div className='main-section-1'>
          <Row className='description-bullets'>
            <Col xs={1}>
              <DescriptionIcon icon='check' />
            </Col>
            <Col xs={3}>
              <DescriptionBullet
                title='Simple'
                description='Monthly rollup of your spending based on major categories'
              />
            </Col>

            <Col xs={1}>
              <DescriptionIcon icon='project-diagram' />
            </Col>
            <Col xs={3}>
              <DescriptionBullet
                title='Flexible'
                description='Create specific or broad rules for categorizing or excluding transactions'
              />
            </Col>

            <Col xs={1}>
              <DescriptionIcon icon='shield-alt' />
            </Col>
            <Col xs={3}>
              <DescriptionBullet
                title='Secure'
                description='We don’t store your credentials. Bank integration is handled by Plaid.'
              />
            </Col>

          </Row>
        </div>

        <DemoSection />
      </div>

      <LandingPageFooter />
    </>
  );
}

export default LandingPage;
