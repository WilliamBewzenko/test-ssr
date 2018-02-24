const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const compression = require('compression');
const bodyParser = require('body-parser');
const Loadable = require('react-loadable');

const indexController = require('./controllers/index');

// Create our express app (using the port optionally specified)
const app = express();

const PORT = process.env.PORT || 3000;

// Compress, parse, and log
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// tell the app to use the above rules
app.use(indexController);

// Let's rock
Loadable.preloadAll().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});

// Handle the bugs somehow
app.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)
