import React, { useEffect } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';

import Game from '#organism/game';
import { Main } from '#shared/providers';
import DataService from '#shared/services/data';
import Layout from '#shared/templates/layout';

const AppHeader = () => (
  <AppBar position="static">
    <Toolbar>Space model</Toolbar>
  </AppBar>
);

const Home = () => {
  const store = Main.userService(DataService);

  useEffect(() => {
    store.set({ id: 123 });
  }, [store.data.id]);

  return (
    <Layout header={AppHeader}>
      <Game />
    </Layout>
  );
};

export default Home;
