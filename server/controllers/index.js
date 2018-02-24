const express = require('express');
const path = require('path');

const serverRenderer = require('../middleware/renderer');

const configureStore = require('../../src/store/configureStore').default;
const { setMessage } = require('../../src/store/appReducer');

const router = express.Router();

const actionIndex = (req, res, next) => {
  const store = configureStore();
  store.dispatch(setMessage("Hi, I'm from server!"));
  serverRenderer(store)(req, res, next);
};

// root (/) should always serve our server rendered page
router.use('^/$', actionIndex);

// other static resources should just be served as they are
router.use(express.static(
  path.resolve(__dirname, '..', '..', 'build'),
  { maxAge: '30d' },
));

module.exports = router;
