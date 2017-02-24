import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import cookieMiddleware from 'redux-effects-universal-cookie';
import get from 'lodash.get';
import aguid from 'aguid';
import reducers from './reducers';

const initialState = global.$$initialState || undefined;
const composer = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle
const localIdentifier = aguid();

const pouchSync = db => (store) => {

    let docIds = [];
    const startSync = () => {
        const sync = db.sync('https://danreeves.cloudant.com/productive-tasks', {
            live: true,
            retry: true,
            include_docs: true,
            doc_ids: docIds,
        }).on('change', (update) => {
            if (process.env.NODE_ENV === 'development') {
                console.log('> PouchDB change', update);
            }
            if (update.change.docs[0].localIdentifier !== localIdentifier) {
                store.dispatch({
                    type: 'HYDRATE',
                    state: update.change.docs[0].state.tasks,
                });
            }
        });
        if (process.env.NODE_ENV === 'development') {
            sync.on('paused', console.log.bind(console, '> PouchDB sync paused'))
                .on('active', console.log.bind(console, '> PouchDB sync active'))
                .on('denied', console.log.bind(console, '> PouchDB sync denied'))
                .on('complete', console.log.bind(console, '> PouchDB sync complete'))
                .on('error', console.log.bind(console, '> PouchDB sync error'));
        }
    };
    let sync;

    return next => (action) => {
        if (action.type === 'LOG_OUT') {
            if (sync) sync.cancel();
            docIds = [];
        }

        const result = next(action);
        const state = store.getState();

        if (action.type === 'LOG_IN') {
            db.get(state.user.id || 'anonymous')
            .then((doc) => {
                if (get(doc, 'state.tasks.allIds').length) {
                    store.dispatch({
                        type: 'HYDRATE',
                        state: doc.state.tasks,
                    });
                    // This is just to trigger an upsert of state -> db
                    // AFTER logging in and AFTER hydrating, so we don't
                    // upsert empty data into the db before we've hydrated
                    store.dispatch({ type: 'LOGGED_IN' });
                }
                // Grab the logged out tasks
            }).catch(console.log.bind(console));
        }

        if (action.type === 'LOGGED_IN' || (!docIds.length && state.user.id)) {
            docIds = [state.user.id];
            if (sync) sync.cancel();
            sync = startSync();
        }

        if (action.type !== 'HYDRATE' && action.type !== 'LOG_IN') {
            db.upsert(state.user.id || 'anonymous', doc => ({
                ...doc,
                state,
                localIdentifier,
            }));
        }

        return result;
    };
};

export default function makeStore ({ cookies, pouchdb } = {}) {
    const cmid = (cookies) ? cookieMiddleware(cookies) : cookieMiddleware();
    const middleware = [
        thunk,
        cmid,
        pouchSync(pouchdb),
    ];
    if (process.env.NODE_ENV === 'development') {
        middleware.push(logger());
    }
    const enhancers = composer(
        applyMiddleware(...middleware),
    );
    return createStore(
        reducers,
        initialState,
        enhancers,
    );
}
