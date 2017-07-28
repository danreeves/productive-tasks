import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PouchDB from 'pouchdb-browser';
import upsert from 'pouchdb-upsert';
import get from 'lodash.get';
import routes from './routes';
import createStore from './store';

PouchDB.plugin(upsert);
const pouchdb = new PouchDB('productive-tasks');
const store = createStore({ pouchdb });

const initialState = store.getState();
pouchdb.get(initialState.user.id || 'anonymous')
.then((doc) => {
    if (get(doc, 'state.tasks.allIds').length) {
        store.dispatch({
            type: 'HYDRATE',
            state: doc.state.tasks,
        });
    }
}).catch(console.log.bind(console));

// Render HTML on the browser
ReactDOM.render(<Provider store={store}>{routes}</Provider>, document.getElementById('root'));
// Remove the ssr rendered styles
// document.getElementById('ssr-styles').remove();
