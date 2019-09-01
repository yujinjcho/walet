import React, { Component } from 'react';
import Summary from './Summary';
import api from '../api';
import values from '../values';

import withLogin from '../withLogin';
import helper from '../helper';

class SummaryContainer extends Component {
  state = {
    transactions: undefined,
    categoryRules: undefined,
    tagRules: undefined,
    tags: undefined,
    categories: undefined,
    accounts: undefined,
    currentMonth: values.months[new Date().getMonth()],
    currentYear: new Date().getFullYear(),
  };

  updateMonth = (month) => this.setState({currentMonth: month});

  updateYear = (year) => this.setState({currentYear: year}, () => this.updateTransactions());

  updateTransactions() {
    const { currentYear } = this.state;
    api.loadTransactions(currentYear)
      .then(res => {
        if (res.error) {
          alert(res.error);
        }
        const transactions = res.result;
        const accounts = transactions
          ? [...new Set(transactions.map(x => x.account_id.slice(0,10)))]
          : [];
        this.setState({transactions: transactions, accounts: accounts});
      })
  }

  componentDidMount() {
    this.getSummaryData();
    this.updateTransactions();
  };

  getSummaryData = () => {
    const { accountId } = this.props;
    return Promise.all([
      api.loadCategoryRules(accountId),
      api.loadTagRules(accountId),
      api.loadTags(accountId),
      api.loadCategories(accountId)
    ])
      .then( res => {
        const [
          categoryRules,
          tagRules,
          tags,
          categories,
        ] = res;

        this.setState({
          categoryRules: categoryRules.result,
          tagRules: tagRules.result,
          tags: tags.result.slice().sort(),
          categories: categories.result.slice().sort(),
        });
      })
      .catch( e => {
        console.error("failed loading summary data")
        console.error(e)
      })
  };

  filterCurrentMonth(transactions) {
    const { currentMonth } = this.state
    return transactions.filter(t => helper.stringToDate(t.date).getMonth() === values.months.indexOf(currentMonth));
  }

  render() {
    const { accountId } = this.props;
    const {transactions, tags, categories, tagRules, categoryRules} = this.state;
    const summaryData = transactions && tags && categories && tagRules && categoryRules
      ? {
        transactions: transactions,
        tags: tags,
        categories: categories,
        tagRules: tagRules,
        categoryRules: categoryRules,
      }
      : undefined

    const { accounts, currentMonth, currentYear } = this.state;

    return (
      <Summary
        accountId={ accountId }
        summaryData={ summaryData }
        getSummaryData={ this.getSummaryData }
        updateMonth = { this.updateMonth }
        updateYear = { this.updateYear }
        currentMonth = { currentMonth }
        currentYear = { currentYear }
        accounts = { accounts }
      />
    );
  }
};

export default withLogin(SummaryContainer);
