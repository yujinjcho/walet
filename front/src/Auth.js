import React from 'react';
import { Redirect } from 'react-router-dom';

import query from './query';
import authHelper from './authHelper';

export default () => {
  const jwt = query.parameters().jwt
  authHelper.saveToken(jwt)
  return <Redirect to='/' />
};
