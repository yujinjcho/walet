import React from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LandingPageNavigation from './LandingPageNavigation';
import { withRouter } from 'react-router-dom';

import './Contact.css';

const handleSubmit = (props) => (event) => {
  const form = event.currentTarget;
  event.preventDefault();

  // TODO: upload message

  alert('Your message has been sent!')
  props.history.push('/');
  console.log(form);
};

const Contact = (props) => {

  return (
    <>
      <LandingPageNavigation authUrl={props.authUrl} />
      <Container>
        <div className='contact-container'>
          <div className='contact-header'>
            Contact
          </div>

          <Form onSubmit={handleSubmit(props)}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label>Subject </Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows="3" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>



        </div>
      </Container>
    </>
  );
}

export default withRouter(Contact);
