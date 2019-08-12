import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { hydrate } from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Application from '#shared/App';

const Main = () => {
  const theme = createMuiTheme({});

  // const stores = createStores();

  const history = createBrowserHistory();
  history.push('/');

  // const history = syncHistoryWithStore(browserHistory, stores.routing!);

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Application />
      </ThemeProvider>
    </Router>
  );
};

hydrate(<Main />, document.getElementById('react-root'));
