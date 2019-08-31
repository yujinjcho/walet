import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import helper from '../helper';
import CategorySection from './CategorySection';
import './Summary.css';
import SummaryController from './SummaryController';
import './TotalSection.css';
import BudgetSection from './BudgetSection';
import ChartSection from './ChartSection';


class Summary extends Component {
  state = {
    error: null,
    success: null,
    selectTags: ['exclude'],
    selectAccounts: undefined,
    shouldExcludeTags: true,
    mode: 'Rules',
  }

  sortCategories = (summary) => summary.slice().sort((x,y) => y.amount - x.amount)

  setError = (error) => this.setState({ error: error });

  setSuccess = (success) => this.setState({ success: success });

  handleActiveTagChange = (data) => this.setState({ selectTags: data.map(x => x.value ) });

  handleAccountChange = (data) => this.setState({ selectAccounts: data.map(x => x.value ) });

  updateMonth = (data, action) => {
    if (data.value !== this.props.currentMonth) {
      this.props.updateMonth(data.value)
    }
  };

  updateYear = (data, action) => {
    if (data.value !== this.props.currentYear) {
      this.props.updateYear(data.value)
    }
  };

  updateMode = (data) => {
    this.setState({ mode: data.value });
  }

  toggleShouldExcludeTags = (data) => {
    if (data.target.id === 'exclude') {
      this.setState({ shouldExcludeTags: true});
    } else {
      this.setState({ shouldExcludeTags: false});
    }
  };

  renderAlerts(error, success) {
    return (
      <Row className='action-alerts'>
        <Col xs={12} >
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Col>
      </Row>
    );
  }

  render() {
    const { accountId, summaryData, getSummaryData, accounts, currentMonth, currentYear } = this.props;

    if (summaryData) {
      const { tags, categories, tagRules, categoryRules, transactions } = summaryData;

      if (categories.length === 0 && transactions.length > 0) {
        getSummaryData();
      }

      const { mode, error, success, selectTags, selectAccounts, shouldExcludeTags } = this.state

      const selectTransactions = selectAccounts ? transactions.filter(t => selectAccounts.includes(t.account_id.slice(0,10))): transactions;
      const updatedTransactions = helper.applyRules(selectTransactions, categoryRules, tagRules, selectTags, shouldExcludeTags)
      const summary = helper.createSummary(updatedTransactions);
      const sortedCategories = this.sortCategories(summary)

      return (
        <div className="summary-container">

          <Container>

            { this.renderAlerts(error, success) }

            <SummaryController
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectTags={selectTags}
              accounts={accounts}
              selectAccounts={selectAccounts || accounts}
              currentMode={mode}
              tags={tags}
              updateMode={this.updateMode}
              updateMonth={this.updateMonth}
              updateYear={this.updateYear}
              handleActiveTagChange={this.handleActiveTagChange}
              handleAccountChange={this.handleAccountChange}
              toggleShouldExcludeTags={this.toggleShouldExcludeTags}
            />

            {/* TODO: if budget mode render buget */}
            <Row>
              <Col xs={12} >
                <ListGroup>

                  { mode === "Rules"
                    ? <CategorySection
                        categories={sortedCategories}
                        allCategories={ categories.map(x => { return {value: x, label: x}}) }
                        allTags={ tags.map(x => {return {value: x, label: x}}) }
                        setError={ this.setError }
                        setSuccess={ this.setSuccess }
                        accountId= { accountId }
                        getSummaryData = { getSummaryData }
                      />
                    : mode === "Budget"
                      ? <BudgetSection
                          categories={sortedCategories}
                          month={currentMonth}
                          year={currentYear}
                        />
                      : mode === "Chart"
                        ? <ChartSection />
                        : undefined
                 }

                </ListGroup>

              </Col>
            </Row>
          </Container>

        </div>
      );
    } else {
      return (
        <div>
          Loading data...
        </div>
      );
    }
  }
}

export default Summary
