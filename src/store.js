import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import cookieMiddleware from 'redux-effects-universal-cookie';
import reducers from './reducers';

const initialState = global.$$initialState || undefined;
const composer = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function (cookies) {
    const cmid = (cookies) ? cookieMiddleware(cookies) : cookieMiddleware();
    const middleware = [
        thunk,
        cmid,
        logger(),
    ];
    const enhancers = composer(applyMiddleware(...middleware));
    return createStore(
        reducers,
        initialState,
        enhancers,
    );
}
