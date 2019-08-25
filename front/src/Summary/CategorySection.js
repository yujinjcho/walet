import React, { Component } from 'react';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import CategoryTotal from './CategoryTotal';
import CategoryTransactions from './CategoryTransactions';
import Collapse from 'react-bootstrap/Collapse'

class CategorySection extends Component {
  state = {
    open: false
  }

  render() {
    const { open } = this.state;
    const { categories } = this.props;
    const total = categories.map(x => x.amount).reduce((acc,x) => acc + x, 0);

    return (
      <>
        { categories.map(category =>
          <div key={category.category} >
            <CategoryTotal
              categoryName={category.category}
              amount={category.amount}
              onClick={ () => this.setState({ open: !open }) }
            />
            <Collapse in={open}>
              <div>
                <CategoryTransactions
                  transactions={ category.transactions }
                  {...this.props}
                />
              </div>
            </Collapse>
          </div>)}

        <ListGroup.Item className='total-section entire-total'>
          <Container>
            <Row>
              <Col xs={9}>Total</Col>
              <Col className='category-subtotal' >{ Math.round(total) }</Col>
            </Row>
          </Container>
        </ListGroup.Item>
      </>
    );
  }
}

export default CategorySection;
