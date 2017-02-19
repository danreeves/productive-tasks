import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PouchDB from 'pouchdb-browser';
import routes from './routes';
import createStore from './store';

const pouchdb = new PouchDB('productive-tasks');
pouchdb.sync('https://danreeves.cloudant.com/productive-tasks', {
    live: true,
    retry: true,
});
const store = createStore({ pouchdb });

// Render HTML on the browser
ReactDOM.render(<Provider store={store}>{routes}</Provider>, document.getElementById('root'));
// Remove the ssr rendered styles
document.getElementById('ssr-styles').remove();
