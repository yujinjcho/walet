import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import './CategoryTotal.css';
import './TotalSection.css';


const CategoryTotal = (props) => {
  const { categoryName, amount, onClick } = props;
  return (
    <div onClick={onClick}>
      <ListGroup.Item className='total-section'>
        <Container>
          <Row>
            <Col xs={9}>{ categoryName }</Col>
            <Col className='category-subtotal' >{ Math.round(amount) }</Col>
          </Row>
        </Container>
      </ListGroup.Item>
    </div>
  );
};

export default CategoryTotal
