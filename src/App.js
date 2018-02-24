import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';

import { setMessage } from './store/appReducer';

import './App.css';

const AsyncComponent = Loadable({
  loader: () => import(/* webpackChunkName: "myNamedChunk" */"./SomeComponent"),
  loading: () => <div>loading...</div>,
  modules: ['myNamedChunk'],
});

class App extends Component {
  componentDidMount() {
    if (!this.props.message) {
      this.props.updateMessage("Hi, I'm from client!");
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <AsyncComponent />
        <p>
          Redux: {this.props.message}
        </p>
      </div>
    );
  }
}

export default connect(
  ({ app }) => ({
    message: app.message,
  }),
  dispatch => ({
    updateMessage: (txt) => dispatch(setMessage(txt)),
  }),
)(App);
