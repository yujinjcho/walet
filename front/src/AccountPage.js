import React, { Component } from 'react';
import _ from 'lodash';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

import withLogin from './withLogin';
import PlaidLink from 'react-plaid-link';
import authHelper from './authHelper';

import './AccountPage.css'

class AccountPage extends Component {
  state = {
    accounts: []
  }

  handleOnSuccess = (publicToken, metadata) => {
    const request = { publicToken: publicToken }
    const headers = {...{ 'Content-Type': 'application/json' }, ...authHelper.header()}
    fetch(`/api/plaid_accounts`, {
      headers,
      method: 'POST',
      body: JSON.stringify(request)
     })
      .then(_ => this.refreshAccounts())
  }

  handleOnExit = () => {
    console.log('customer exited')
  }

  componentDidMount() {
    if (!this.state.accounts.length) {
      this.refreshAccounts()
    }
  }

  refreshAccounts = () =>
    fetch(`/api/plaid_accounts`, { headers: authHelper.header() })
      .then(res => res.json())
      .then(res => this.setState({accounts: res.result}))

  formatAccountDescription(account) {
    const official = account.official_names.map(x => _.upperFirst(_.toLower(x)))
    const names = account.names.map(x => _.upperFirst(_.toLower(x))).filter(x => !official.includes(x))
    return _.compact(official.concat(names)).join(', ');
  }

  formatInstitution = (institutionId) => institutionId.split('_').map(x => _.upperFirst(x)).join(' ');

  handleRemoveAccount = (e) => alert('This functionality has not been implemented yet!');

  render() {
    const { accounts } = this.state;
    return (
      <Container>

        <Row>
          <Col xs={12}>
            <h2>Accounts</h2>
            <PlaidLink
              clientName="walet"
              env="development"
              product={["auth", "transactions"]}
              publicKey="d9f0a56826f5d4249fdad6f82c89d4"
              onExit={this.handleOnExit}
              onSuccess={this.handleOnSuccess}>
              Connect Bank
            </PlaidLink>
          </Col>
        </Row>

        <div className='linked-accounts'>
          { accounts.map(account =>
            <Row key={account.item_id} className='account-row'>
              <Card style={{ width: '40rem' }}>
                <Card.Body>
                  <Card.Title>{this.formatInstitution(account.institution_id)}</Card.Title>
                  <Card.Text>
                    {this.formatAccountDescription(account)}
                  </Card.Text>
                  {/* TODO: add remove capability */}
                  <Card.Link href="#" onClick={ this.handleRemoveAccount }>Remove</Card.Link>
                </Card.Body>
              </Card>
            </Row>
          )}
        </div>

      </Container>

    );
  }
};

export default withLogin(AccountPage);
