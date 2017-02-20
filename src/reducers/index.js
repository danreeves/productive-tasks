import { combineReducers } from 'redux';
import { reducer as user } from './user';
import { reducer as tasks } from '../containers/Tasks';

export default combineReducers({
    user,
    tasks,
});
