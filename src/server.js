/* eslint no-param-reassign: 0 */
import 'dotenv/config';
import React from 'react';
import { renderToString } from 'react-dom/server';
import styleSheet from 'styled-components/lib/models/StyleSheet';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import Koa from 'koa';
import serve from 'koa-static';
import { cookie } from 'redux-effects-universal-cookie';
import PouchDB from 'pouchdb-node';

import favicon from './server/favicon';
import bundle from './server/js-bundle';
import HTML from './server/html';
import routes from './routes';
import createStore from './store';

const pouchdb = new PouchDB('https://danreeves.cloudant.com/productive-tasks', {
    auth: {
        username: process.env.cloudant_username,
        password: process.env.cloudant_password,
    },
});
const app = new Koa();
const port = 3000;

app.use(favicon);
app.use(bundle);
app.use(serve('static'));

app.use(async (ctx, next) => {
    console.log(`Request: ${ctx.url}`);
    const cookies = ctx.cookies;
    // Set up initial store
    const store = createStore({
        cookies,
        pouchdb,
    });
    const { state } = await pouchdb.get('tasks');
    store.dispatch({
        type: 'redux-pouchdb/SET_REDUCER',
        reducer: 'tasks',
        state,
    });
    // if (cookies.get('user')) {
        // const user = JSON.parse(decodeURIComponent(await store.dispatch(cookie('user'))));
        // store.dispatch({ type: 'LOG_IN_SUCCESS', user });
    // }
    // Match route in router
    match({ routes, location: ctx.url }, async (error, redirectLocation, renderProps) => {
        if (error) {
            ctx.body = error;
            await next();
        } else {
            const html = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>);
            const styles = styleSheet.rules().map(rule => rule.cssText).join('\n');
            const initialState = store.getState();
            ctx.body = HTML({ html, styles, initialState });
            await next();
        }
    });
});

app.listen(port);
console.log(`> Listening on http://localhost:${port}`);
