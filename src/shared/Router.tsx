import React from 'react';
import { Route } from 'react-router-dom';

import Home from './pages/home';

const Router: React.SFC = ({ children }) => (
  <React.Fragment>
    <Route exact path="/" component={Home} />
  </React.Fragment>
);

export default Router;
