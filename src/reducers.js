import { combineReducers } from 'redux';
import { reducer as tasks } from './containers/Tasks';

export default combineReducers({
    tasks,
});
