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
    db.sync('https://danreeves.cloudant.com/productive-tasks', {
        live: true,
        since: 'now',
        retry: true,
        include_docs: true,
        // doc_ids: [state.user.id],
    }).on('change', (update) => {
        if (update.change.docs[0].localIdentifier !== localIdentifier) {
            console.log('> Recieving remote update', update)
            store.dispatch({
                type: 'HYDRATE',
                state: update.change.docs[0].state.tasks,
            });
        }
    });
    return next => (action) => {
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
                }
                // Grab the logged out tasks
            }).catch(console.log.bind(console));
        }

        if (action.type !== 'HYDRATE') {
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
