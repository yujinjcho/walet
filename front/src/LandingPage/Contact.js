import React from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LandingPageNavigation from './LandingPageNavigation';
import { withRouter } from 'react-router-dom';

import api from '../api';

import './Contact.css';

const handleSubmit = (props) => (event) => {
  event.preventDefault();
  const form = event.target;
  const email = form.elements.email.value;
  const subject = form.elements.subject.value;
  const message = form.elements.message.value;

  if (email && subject && message ) {
    const request = {
      email: email,
      subject: subject,
      message: message,
    };
    const headers = { 'Content-Type': 'application/json' };
    api.fetchHelper('/api/contact', {
      headers,
      method: 'POST',
      body: JSON.stringify(request)
    })
    .then(_ => {
      alert('Your message has been sent!')
      props.history.push('/')
    })
    .catch(_ => alert('There was an issue sending the message!'))
  } else {
    alert('requires valid fields')
  };
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
            <Form.Group controlId="form.email">
              <Form.Label>Email address</Form.Label>
              <Form.Control name="email" type="email" placeholder="name@example.com" />
            </Form.Group>

            <Form.Group controlId="form.subject">
              <Form.Label>Subject </Form.Label>
              <Form.Control name="subject" />
            </Form.Group>

            <Form.Group controlId="form.message">
              <Form.Label>Message</Form.Label>
              <Form.Control name="message" as="textarea" rows="3" />
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
