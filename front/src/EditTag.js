import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import authHelper from './authHelper';

import './EditTag.css';

class EditTag extends Component {

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
    this.setState({ targetType: 'category', targetValue: this.props.transaction.assignedCategory });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { targetType } = this.state;
    const targetValue = targetType === 'name_contains'
      ? e.target.nameContainsValue.value
      : this.state.targetValue

    if (targetType && targetValue) {
      const rule = JSON.stringify({
        target_type: targetType,
        target_value: targetValue,
        tag: this.props.selectedTag,
      });

      const headers = Object.assign({ 'Content-Type': 'application/json'}, authHelper.header());
      fetch('/api/tag_rules', {
        method: 'POST',
        headers: headers,
        body: rule
      })
        .then(res => res.json())
        .then(res => {
          this.props.setSuccess('Rule successfully created');
          this.props.getSummaryData();
        })
        .catch(_ => this.props.setError('There was an issue creating the rule'))
    }

    this.props.handleClose();
  }

  render() {
    const { show, transaction, selectedTag, handleClose } = this.props;
    return (
      <>

        <Modal show={show} onHide={ handleClose }>
          <Modal.Header >
            <Modal.Title>Create New Rule</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Assign the tag <b>{ selectedTag }</b> to the following:
          </Modal.Body>

          <Form onSubmit={this.handleSubmit}>
            <Modal.Body>

              <div className='tag-rule-option' >
                <Form.Check
                  defaultChecked
                  type="radio"
                  label='Only this transaction'
                  name="ruleOption"
                  id="formHorizontalRadios1"
                  onClick={ this.setTransactionIdRule }
                />
              </div>

              <div className='tag-rule-option' >
                <Form.Check
                  type="radio"
                  label='Transaction name matching: '
                  name="ruleOption"
                  id="formHorizontalRadios2"
                  onClick={ this.setNameRule }
                />
                <b>{ transaction.name }</b>
              </div>

              <div className='tag-rule-option' >
                <Form.Check
                  type="radio"
                  label="Transaction names containing: "
                  name="ruleOption"
                  id="formHorizontalRadios3"
                  onClick={ this.setNameContainsRule }
                />
                <Form.Control name="nameContainsValue" placeholder={transaction.name} />
              </div>

              <div className='tag-rule-option' >
                <Form.Check
                  type="radio"
                  label="Assigned category matching: "
                  name="ruleOption"
                  id="formHorizontalRadios4"
                  onClick={ this.setCategoryRule }
                />
                <b>{ transaction.assignedCategory }</b>
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

export default EditTag;
