import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import './CategoryTotal.css';
import './TotalSection.css'

class CategoryTotal extends Component {
  state = {
    open: false
  }

  render() {
    const { categoryName, amount } = this.props;
    return (
      <ListGroup.Item className='total-section'>
        <Container>
          <Row>
            <Col xs={9}>{ categoryName }</Col>
            <Col className='category-subtotal' >{ Math.round(amount) }</Col>
          </Row>
        </Container>
      </ListGroup.Item>
    );
  }
}

export default CategoryTotal
