import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from '#shared/App';

const theme = createMuiTheme({});

function Main() {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Application />
      </ThemeProvider>
    </BrowserRouter>
  );
}

hydrate(<Main />, document.getElementById('react-root'));
