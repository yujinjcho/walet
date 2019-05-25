import React from 'react';
import { Redirect } from 'react-router-dom';

import authHelper from './authHelper';

export default () => {
  authHelper.removeToken()
  return <Redirect to='/' />
};
