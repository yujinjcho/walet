import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import authHelper from './authHelper';

import './EditCategory.css';

class EditCategory extends Component {

  state = {
    targetType: 'transaction_id',
    targetValue: this.props.transaction.transaction_id,
  };

  setTransactionIdRule = (e) => {
    this.setState({targetType: 'transaction_id', targetValue: this.props.transaction.transaction_id});
  }

  setNameRule = (e) => {
    this.setState({targetType: 'name', targetValue: this.props.transaction.name});
  }

  setNameContainsRule = (e) => {
    this.setState({ targetType: 'name_contains', targetValue: undefined });
  }

  setCategoryRule = (e) => {
    this.setState({ targetType: 'category_id', targetValue: this.props.transaction.category_id });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { targetType } = this.state;
    const targetValue = targetType === 'name_contains'
      ? e.target.nameContainsValue.value
      : this.state.targetValue

    const rule = JSON.stringify({
      target_type: targetType,
      target_value: targetValue,
      category: this.props.selectedCategory,
    });

    const headers = {...{ 'Content-Type': 'application/json' }, ...authHelper.header()}
    fetch(`/api/category_rules`, {
      method: 'POST',
      headers,
      body: rule
    })
      .then(res => res.json())
      .then(res => {
        this.props.setSuccess('Rule successfully created');
        this.props.getSummaryData();
      })
      .catch(_ => this.props.setError('There was an issue creating the rule'))

    this.props.handleClose();
  }

  render() {
    const { show, transaction, selectedCategory, handleClose } = this.props;
    return (
      <>

        <Modal show={show} onHide={ handleClose }>
          <Modal.Header >
            <Modal.Title>Create New Rule</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Assign the category <b>{ selectedCategory }</b> to the following:
          </Modal.Body>

          <Form onSubmit={this.handleSubmit}>
            <Modal.Body>

              <div className='category-rule-option' >
                <Form.Check
                  defaultChecked
                  type="radio"
                  label='Only this transaction'
                  name="ruleOption"
                  id="formHorizontalRadios1"
                  onClick={ this.setTransactionIdRule }
                />
              </div>

              <div className='category-rule-option' >
                <Form.Check
                  type="radio"
                  label='Transaction name matching: '
                  name="ruleOption"
                  id="formHorizontalRadios1"
                  onClick={ this.setNameRule }
                />
                <b>{ transaction.name }</b>
              </div>

              <div className='category-rule-option' >
                <Form.Check
                  type="radio"
                  label="Transaction names containing: "
                  name="ruleOption"
                  id="formHorizontalRadios2"
                  onClick={ this.setNameContainsRule }
                />
                <Form.Control name="nameContainsValue" placeholder={transaction.name} />
              </div>

              <div className='category-rule-option' >
                <Form.Check
                  type="radio"
                  label="Categories matching: "
                  name="ruleOption"
                  id="formHorizontalRadios3"
                  onClick={ this.setCategoryRule }
                />
                <b>{ transaction.category.join( ' > ') }</b>
              </div>

            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={ handleClose }>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>

          </Form>
        </Modal>
      </>
    );
  }
}

export default EditCategory;
