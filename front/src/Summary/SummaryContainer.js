import React, { Component } from 'react';
import Summary from './Summary';
import api from '../api';
import values from '../values';

import withLogin from '../withLogin';

class SummaryContainer extends Component {
  state = {
    transactions: undefined,
    categoryRules: undefined,
    tagRules: undefined,
    tags: undefined,
    budget: undefined,
    categories: undefined,
    // currentMonth: values.months[new Date().getMonth()],
    // TODO: fix this
    currentMonth: values.months[new Date().getMonth() - 1],
  };

  updateMonth = (month) => {
    this.setState({currentMonth: month}, () => this.getSummaryData(month));
  }

  componentDidMount() {
    this.getSummaryData()
  };

  getSummaryData = () => {
    const { accountId } = this.props;
    return Promise.all([
      api.loadTransactions(accountId, this.state.currentMonth),
      api.loadCategoryRules(accountId),
      api.loadTagRules(accountId),
      api.loadTags(accountId),
      api.loadCategories(accountId)
    ])
      .then( res => {
        const [
          transactions,
          categoryRules,
          tagRules,
          tags,
          categories,
        ] = res;

        const budget = [
          {"category_name": "Food and Drink", "budget":500},
          {"category_name": "Grocery", "budget":400},
          {"category_name": "Recreation", "budget":200},
          {"category_name": "Travel", "budget":100},
          {"category_name": "Misc", "budget":100},
          {"category_name": "Shops", "budget":300}
        ];

        if (transactions.error) {
          alert(transactions.error);
        }

        this.setState({
          transactions: transactions.result,
          categoryRules: categoryRules.result,
          tagRules: tagRules.result,
          tags: tags.result.slice().sort(),
          budget: budget,
          categories: categories.result.slice().sort(),
        });
      })
      .catch( e => {
        console.error("failed loading summary data")
        console.error(e)
      })
  };

  render() {
    const { accountId } = this.props;
    const {transactions, tags, budget, categories, tagRules, categoryRules} = this.state;
    const summaryData = transactions && tags && categories && tagRules && categoryRules
      ? {
        transactions: transactions,
        tags: tags,
        budget: budget,
        categories: categories,
        tagRules: tagRules,
        categoryRules: categoryRules,
      }
      : undefined

    return (
      <Summary
        accountId={ accountId }
        summaryData={ summaryData }
        getSummaryData={ this.getSummaryData }
        updateMonth = { this.updateMonth }
        currentMonth = { this.state.currentMonth }
      />
    );
  }
};

export default withLogin(SummaryContainer);
