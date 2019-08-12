import React from 'react';
import { hot } from 'react-hot-loader/root';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Routes from './Router';
import Layout from './templates/layout';
import { Main } from './providers';

import DataService from './services/data';

const useStyles = makeStyles({
  '@global': {
    body: {
      margin: 0,
      backgroundColor: '#eee',
    },
  },
});

const AppHeader = () => (
  <AppBar position="static">
    <Toolbar>Space model</Toolbar>
  </AppBar>
);

const AppFooter = () => <React.Fragment>Footer</React.Fragment>;

const App = () => {
  useStyles();

  return (
    <Main.Provider services={[[DataService, DataService()]]}>
      <Layout header={AppHeader} footer={AppFooter}>
        <Routes />
      </Layout>
    </Main.Provider>
  );
};

let Apppp = App;
if (process.env.NODE_ENV !== 'production') {
  Apppp = hot(App);
}

export default Apppp;
