import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SummaryContainer from './SummaryContainer';
import LandingPage from './LandingPage';
import Logout from './Logout';
import Auth from './Auth';
import AccountPage from './AccountPage';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <>
            <Route exact path="/" component={SummaryContainer} />
            <Route exact path="/account" component={AccountPage} />
            <Route exact path ="/login" component={LandingPage} />
            <Route exact path ="/logout" component={Logout} />
            <Route exact path ="/auth" component={Auth} />
          </>
        </Router>
      </div>
    );
  }
}

export default App;
