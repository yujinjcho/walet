import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Navigation from './Navigation';
import authHelper from './authHelper';

export default Wrapped => {
  class WithLogin extends Component {
    state = {
      accountId: null
    };

    handleError = error => {
      this.setState({ accountId: null });
      authHelper.removeToken();
      this.props.history.push('/login')
    }

    componentWillMount() {
      fetch('/api/validate/account', { headers: authHelper.header() })
        .then(res => res.json())
        .then(res => this.setState({ accountId: res.result }))
        .catch(this.handleError);
    }

    render() {
      if (this.state.accountId) {
        return (
          <>
            <Navigation />
            <Wrapped {...this.props} accountId={this.state.accountId} />
          </>
        );
      } else {
        return  (
          <Navigation />
        );
      }
    }
  }

  return withRouter(WithLogin);
};
