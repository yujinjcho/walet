import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';

import CategorySection from './CategorySection';
import './Summary.css';
import './TotalSection.css';
import helper from '../helper';
import values from '../values';

class Summary extends Component {
  state = {
    error: null,
    success: null,
    selectTags: ['exclude'],
    shouldExcludeTags: true,
    currentYear: 2019
  }

  sortCategories = (summary) => summary.slice().sort((x,y) => y.amount - x.amount)

  setError = (error) => this.setState({ error: error });

  setSuccess = (success) => this.setState({ success: success });

  handleActiveTagChange = (data) => this.setState({ selectTags: data.map(x => x.value ) });

  updateMonth = (data, action) => {
    if (data.value !== this.props.currentMonth) {
      this.props.updateMonth(data.value)
    }
  };

  toggleShouldExcludeTags = (data) => {
    if (data.target.id === 'exclude') {
      this.setState({ shouldExcludeTags: true});
    } else {
      this.setState({ shouldExcludeTags: false});
    }
  };

  render() {
    const { accountId, summaryData, getSummaryData, currentMonth } = this.props;

    if (summaryData) {
      const { tags, categories, tagRules, categoryRules, transactions } = summaryData;

      if (categories.length === 0 && transactions.length > 0) {
        getSummaryData();
      }

      const { error, success, selectTags, shouldExcludeTags } = this.state

      const updatedTransactions = helper.applyRules(transactions, categoryRules, tagRules, selectTags, shouldExcludeTags)
      const summary = helper.createSummary(updatedTransactions);
      const total = summary.map(x => x.amount).reduce((acc,x) => acc + x, 0);
      const monthOptions = values.months.map(x => { return { value:x, label:x }});

      return (
        <div className="summary-container">

          <Container>

            <Row className='action-alerts'>
              <Col xs={12} >
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
              </Col>
            </Row>

            <Row className='summary-controller'>
              <Col xs={12} >
                <ListGroup>
                  <ListGroup.Item className='controller-section'>
                    <Container>

                      <Row className='date-tag-select'>
                        <Col xs={1} >
                          <div>
                            Date
                          </div>
                        </Col>
                        <Col xs={3} >
                            <Select
                              className='active-date'
                              label='some label'
                              defaultValue={ monthOptions.find(x => x.value === currentMonth) }
                              options={ monthOptions }
                              onChange= { this.updateMonth }
                            />
                        </Col>
                      </Row>

                      <Row className='date-tag-select'>
                        <Col xs={1} >
                          <div>
                            Tags
                          </div>
                        </Col>
                        <Col xs={3} >
                          <Select
                            className="active-tags"
                            isMulti
                            tags
                            value = { selectTags.map(x => { return { value: x, label: x } }) }
                            options={ tags.map(x => {return {value: x, label: x}}) }
                            onChange = {this.handleActiveTagChange }
                          />
                        </Col>

                      </Row>

                      <Row className='toggle-tags'>
                        <Col xs={3} >
                          <Form.Check
                            defaultChecked
                            type="radio"
                            label='Exclude tags'
                            name="excludeTags"
                            id="exclude"
                            onClick = { this.toggleShouldExcludeTags }
                          />
                        </Col>

                        <Col xs={3} >
                          <Form.Check
                            type="radio"
                            label='Only show tags'
                            name="excludeTags"
                            id="notExclude"
                            onClick = { this.toggleShouldExcludeTags }
                          />
                        </Col>
                      </Row>

                    </Container>

                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>


            <Row>
              <Col xs={12} >
                <ListGroup>
                  { this.sortCategories(summary).map(category =>
                    <CategorySection
                      key={category.category}
                      category={category}
                      allCategories={ categories.map(x => { return {value: x, label: x}}) }
                      allTags={ tags.map(x => {return {value: x, label: x}}) }
                      setError={ this.setError }
                      setSuccess={ this.setSuccess }
                      accountId= { accountId }
                      getSummaryData = { getSummaryData }
                    />)
                  }

                  <ListGroup.Item className='total-section entire-total'>
                    <Container>
                      <Row>
                        <Col xs={9}>Total</Col>
                        <Col className='category-subtotal' >{ Math.round(total) }</Col>
                      </Row>
                    </Container>
                  </ListGroup.Item>
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
