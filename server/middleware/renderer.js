const fs = require('fs');
const path = require('path');

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Loadable = require('react-loadable');
const ReduxProvider = require('react-redux').Provider;

const manifest = require('../../build/asset-manifest.json');

const App = require('../../src/App').default;

const extractAssets = (assets, chunks) => Object.keys(assets)
    .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
    .map(k => assets[k]);

module.exports = (store) => (req, res, next) => {
  const modules = [];

  // point to the html file created by CRA's build tool
  const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      return res.status(404).end()
    }

    const html = ReactDOMServer.renderToString(
      <Loadable.Capture report={m => modules.push(m)}>
        <ReduxProvider store={store}>
          <App/>
        </ReduxProvider>
      </Loadable.Capture>
    );

    const reduxState = JSON.stringify(store.getState());

    const extraChunks = extractAssets(manifest, modules).map(c =>
      `<script type="text/javascript" will="true" src="/${c}"></script>`
    );

    return res.send(
      htmlData.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      )
      .replace(
        '</body>',
        extraChunks.join('') + '</body>'
      )
      .replace('__SERVER_REDUX_STATE__', reduxState)
    );
  });
}
