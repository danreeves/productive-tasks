import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import routes from './routes';
import createStore from './store';

const store = createStore();

// Render HTML on the browser
ReactDOM.render(<Provider store={store}>{routes}</Provider>, document.getElementById('root'));
