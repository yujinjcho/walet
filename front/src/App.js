import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Logout from './Logout';
import Auth from './Auth';
import AccountPage from './AccountPage';
import SummaryContainer from './Summary';

import { LandingPage, About, HowItWorks, Contact }  from './LandingPage';


import api from './api';

const App = () => {
  const [authRedirectUrl, setAuthRedirectUrl] = useState(undefined);

  useEffect(() => {
    const fetchAuthUrl = async () => {
      const result = await api.fetchHelper('/api/auth/login')
        .then(res => res.json())
        .then(res => res.result)
        .catch(_ => {
          console.error('failed to retrieve authentication url');
          return undefined;
        })

      setAuthRedirectUrl(result);
    };

    fetchAuthUrl();
  }, []);

    return (
          <Router>
            <>
              <Route exact path="/" component={SummaryContainer} />
              <Route exact path="/account" component={AccountPage} />
              <Route exact path ="/logout" component={Logout} />
              <Route exact path ="/auth" component={Auth} />

              <Route exact path ="/login" render={() => <LandingPage authUrl={authRedirectUrl} />} />
              <Route exact path ="/how-it-works" render={() => <HowItWorks authUrl={authRedirectUrl} />} />
              <Route exact path ="/about" render={() => <About authUrl={authRedirectUrl} />} />
              <Route exact path ="/contact" render={() => <Contact authUrl={authRedirectUrl} />} />
            </>
          </Router>
    );
  }

export default App;
