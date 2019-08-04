import React, { Component } from 'react';

import CategoryTotal from './CategoryTotal';
import CategoryTransactions from './CategoryTransactions';
import Collapse from 'react-bootstrap/Collapse'

class CategorySection extends Component {
  state = {
    open: false
  }

  render() {
    const { open } = this.state;
    const { category } = this.props;

    return (
      <div>
        <div onClick={ () => this.setState({ open: !open }) }>
          <CategoryTotal categoryName={category.category} amount={category.amount} />
        </ div>
        <Collapse in={open}>
          <div>
            <CategoryTransactions
              transactions={ category.transactions }
              {...this.props}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default CategorySection;
