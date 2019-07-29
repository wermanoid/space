import React from 'react';
import { hot } from 'react-hot-loader/root';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Routes from './Router';
import Layout from './templates/layout';

const useStyles = makeStyles({
  '@global': {
    body: {
      margin: 0,
    },
  },
});

const AppHeader = () => (
  <AppBar position="static">
    <Toolbar>Trololo</Toolbar>
  </AppBar>
);

const AppFooter = () => <React.Fragment>Footer</React.Fragment>;

const App = () => {
  useStyles();

  return (
    <Layout header={AppHeader} footer={AppFooter}>
      <Routes />
    </Layout>
  );
};

let Apppp = App;
if (process.env.NODE_ENV !== 'production') {
  Apppp = hot(App);
}

export default Apppp;
