import { NextFunction, Request, Response } from 'express';
import { join, map, pipe } from 'lodash/fp';
import { renderToNodeStream } from 'react-dom/server';

import { renderApp } from './renderer';

const getScriptsTags = pipe(
  map(
    file =>
      `<script defer type="application/javascript" src="${file}"></script>`
  ),
  join('')
);

export default async (req: Request, res: Response, next: NextFunction) => {
  const assets = [
    res.locals.assetPath('manifest.js'),
    res.locals.assetPath('vendor.js'),
    res.locals.assetPath('client.js'),
  ];

  const scripts = getScriptsTags(assets);

  const renderer = renderApp(req);

  res.contentType('text/html');
  res.write(`
    <html lang="en">
      <head>
        <base href="/" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        ${scripts}
      </head>
      <body>
        <div id="react-root">`);

  const stream = renderToNodeStream(renderer.app);
  stream.pipe(
    res,
    { end: false }
  );
  stream.on('end', () => {
    res.end(`</div>
        <style id="jss-server-side">${renderer.css}</style>
      </body>
    </html>
    `);
  });
};
