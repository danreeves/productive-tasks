import React from 'react';
import { connect } from 'react-redux';
import createReducer from '../util/create-reducer';
import uuid from '../util/uuid';
import { actions as userActions } from '../reducers/user';

import TaskList from '../components/TaskList';
import Task from '../components/Task';
import H2 from '../components/H2';
import Tagline from '../components/Tagline';
import Button from '../components/Button';

const types = {
    ADD_TASK: 'ADD_TASK',
    UPDATE_TASK: 'UPDATE_TASK',
    CLEAR_ALL: 'CLEAR_ALL',
    HYDRATE: 'HYDRATE',
};

const initialState = {
    byId: {},
    allIds: [],
};

export const reducer = createReducer(initialState, {
    [types.ADD_TASK]: function addTask (state, action) {
        return {
            ...state,
            byId: {
                ...state.byId,
                [action.task.id]: {
                    id: action.task.id,
                    task: action.task.task || 'Build a react app',
                    outcome: action.task.outcome || 'learn React',
                    desire: action.task.desire || 'become a better developer',
                    done: false,
                },
            },
            allIds: [action.task.id, ...state.allIds],
        };
    },
    [types.UPDATE_TASK]: function updateTask (state, action) {
        return {
            ...state,
            byId: {
                ...state.byId,
                [action.task]: {
                    ...state.byId[action.task],
                    ...action.update,
                },
            },
        };
    },
    [types.CLEAR_ALL]: function clearAll (state) {
        return {
            ...state,
            byId: {},
            allIds: [],
        };
    },
    [types.HYDRATE]: function hydrate (state, action) {
        return {
            ...action.state,
        };
    },
});

function Tasks ({ user, tasks, onChange, newTask, clearAll, login, logout }) {
    const todo = tasks.allIds.filter(task => !tasks.byId[task].done);
    const done = tasks.allIds.filter(task => tasks.byId[task].done);
    return (<div>
        <header>
            {(user.name) ? <div>
                <H2>Hi, Dan 👋</H2>
                <Tagline>Let&apos;s get busy</Tagline>
                <Button onClick={newTask}>New task</Button>
                {(tasks.allIds.length) ? <Button negative onClick={clearAll}>Clear all</Button> : null}
                <Button negative onClick={logout}>Log out</Button>
            </div> : <div>
                <Button onClick={login}>Log in</Button>
                <Button onClick={newTask}>New task</Button>
            </div>}
        </header>
        {(todo.length) ?
            <div>
                <h3>To do</h3>
                <TaskList>
                    {todo.map(task => <Task
                      {...tasks.byId[task]}
                      taskId={task}
                      key={task}
                      onChange={onChange}
                    />)}
                </TaskList>
            </div>
            : null}
        {(done.length) ?
            <div>
                <h3>Done</h3>
                <TaskList done>
                    {done.map(task => <Task
                      {...tasks.byId[task]}
                      taskId={task}
                      key={task}
                      onChange={onChange}
                    />)}
                </TaskList>
            </div>
        : null}
    </div>);
}

function mapStateToProps (state) {
    return {
        tasks: state.tasks,
        user: state.user,
    };
}

function mapDispatchToProps (dispatch) {
    return {
        onChange (update) {
            dispatch({
                type: types.UPDATE_TASK,
                ...update,
            });
        },
        newTask () {
            dispatch({
                type: types.ADD_TASK,
                task: {
                    id: uuid(),
                },
            });
        },
        clearAll () {
            dispatch({
                type: types.CLEAR_ALL,
            });
        },
        login () {
            dispatch(userActions.login());
        },
        logout () {
            dispatch(userActions.logout());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
