import { cookie } from 'redux-effects-universal-cookie';
import { hash } from 'spark-md5';
import createReducer from '../util/create-reducer';

export const types = {
    LOG_IN: 'LOG_IN',
    LOG_OUT: 'LOG_OUT',
};

const initialState = {
    name: '',
    email: '',
    id: '',
};

export const reducer = createReducer(initialState, {
    [types.LOG_IN]: function logIn (state, action) {
        return {
            ...state,
            ...action.user,
        };
    },
    [types.LOG_OUT]: function logOut () {
        return {
            ...initialState,
        };
    },
});

export const actions = {
    login () {
        return (dispatch) => {
            const user = {
                name: 'Dan',
                email: 'hey@danreev.es',
                id: hash('hey@danreeves'),
            };
            dispatch({
                type: types.LOG_IN,
                user,
            });
            return dispatch(cookie('user', JSON.stringify(user)));
        };
    },
    logout () {
        return (dispatch) => {
            dispatch(cookie('user', undefined));
            dispatch({ type: 'LOG_OUT' });
            dispatch({ type: 'CLEAR_ALL' });
        };
    },
};
