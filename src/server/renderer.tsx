import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import { StaticRouter } from 'react-router';
import { Request } from 'express';

import Application from '#shared/App';

export const renderApp = (req: Request) => {
  // Create a sheetsRegistry instance.
  const sheets = new ServerStyleSheets();

  // Create a theme instance.
  const theme = createMuiTheme({});

  const routerContext = {};

  // Render the component to a string.
  const app = sheets.collect(
    <StaticRouter location={req.url} context={routerContext}>
      <ThemeProvider theme={theme}>
        <Application />
      </ThemeProvider>
    </StaticRouter>
  );

  // Send the rendered page back to the client.
  return {
    app,
    get css() {
      return sheets.toString();
    },
  };
};
