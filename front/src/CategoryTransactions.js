import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'

import CategoryTransaction from './CategoryTransaction';

import './CategoryTransactions.css';


class CategoryTransactions extends Component {

  sortTransactions = (transactions) => transactions.slice().sort((x,y) => y.amount - x.amount)

  render() {
    const { transactions } = this.props;
    return (
      <ListGroup>
        { this.sortTransactions(transactions).map(transaction =>

            <CategoryTransaction
              key = {transaction.transaction_id}
              transaction={transaction}
              {...this.props}
            />

          )
        }

      </ListGroup>
    );
  }
}

export default CategoryTransactions;
