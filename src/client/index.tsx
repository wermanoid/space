import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { hydrate } from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';

import { createStores } from '#shared/stores';
import Application from '#shared/App';

const Main = () => {
  const theme = createMuiTheme({});

  const stores = createStores();

  const browserHistory = createBrowserHistory();

  const history = syncHistoryWithStore(browserHistory, stores.routing!);

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <Provider {...stores}>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <Application />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

hydrate(<Main />, document.getElementById('react-root'));
