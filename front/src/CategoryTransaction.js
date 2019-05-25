import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import EditCategory from './EditCategory';
import EditTag from './EditTag';
import CreatableSelect from 'react-select/lib/Creatable';

import './CategoryTransaction.css';


class CategoryTransaction extends Component {
  state = {
    openCategoryEdit: false,
    openTagEdit: false,
    selectedCategory: undefined,
    selectedTag: undefined,
  }

  renderCategoryEdit = (transaction) => (value, action) => {
    if (['select-option', 'create-option'].includes(action.action)) {
      this.setState({ openCategoryEdit: true, selectedCategory: value.value })
    }
  };

  renderTagEdit = (transaction) => (value, action) => {
    if (['select-option', 'create-option'].includes(action.action)) {
      this.setState({ openTagEdit: true, selectedTag: value[0].value })
    };
  };

  handleCategoryClose = () => {
    this.setState({ openCategoryEdit: false })
  };

  handleTagClose = () => {
    this.setState({ openTagEdit: false })
  };

  render() {
    const {
      transaction,
      allCategories,
      allTags,
      setError,
      setSuccess,
      accountId,
      getSummaryData,
    } = this.props;
    const { openCategoryEdit, openTagEdit, selectedCategory, selectedTag } = this.state;
    const setTags = transaction.tags.map(t => {return {label: t, value: t}})



    return (
      <ListGroup.Item className='transaction-row'>
          <Container>
            <Row>
              <Col xs={5} className='category-transactions-name'>{ transaction.name }</Col>

              <Col xs={2} className='category-transactions-name'>
                <CreatableSelect
                  options={ allCategories }
                  defaultValue={ selectedCategory }
                  onChange={ this.renderCategoryEdit(transaction) }
                />
              </Col>

              <Col xs={3} className='category-transactions-name'>
                <CreatableSelect
                  isMulti
                  onChange={ this.renderTagEdit(transaction) }
                  defaultValue={ setTags }
                  options={ allTags }
                />

              </Col>
              <Col className='category-transactions' >{ Math.round(transaction.amount) }</Col>
            </Row>

            <EditCategory
              transaction={ transaction }
              selectedCategory={ selectedCategory }
              show={ openCategoryEdit }
              handleClose={ this.handleCategoryClose }
              setError={ setError }
              setSuccess= { setSuccess }
              accountId = { accountId }
              getSummaryData = { getSummaryData }
            />
            <EditTag
              transaction={ transaction }
              selectedCategory={ selectedCategory }
              selectedTag={ selectedTag }
              show={ openTagEdit }
              handleClose={ this.handleTagClose }
              setError={ setError }
              setSuccess= { setSuccess }
              accountId = { accountId }
              getSummaryData = { getSummaryData }

            />

          </Container>
      </ListGroup.Item>
    );
  }
}

export default CategoryTransaction;
