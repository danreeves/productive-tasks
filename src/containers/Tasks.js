import React from 'react';
import { connect } from 'react-redux';
import { persistentReducer } from 'redux-pouchdb';
import createReducer from '../util/create-reducer';
import uuid from '../util/uuid';

import TaskList from '../components/TaskList';
import Task from '../components/Task';
import H2 from '../components/H2';
import Tagline from '../components/Tagline';
import Button from '../components/Button';

const types = {
    ADD_TASK: 'ADD_TASK',
    UPDATE_TASK: 'UPDATE_TASK',
    CLEAR_ALL: 'CLEAR_ALL',
};

const initialState = {
    byId: {},
    allIds: [],
};

export const reducer = persistentReducer(createReducer(initialState, {
    [types.ADD_TASK]: function addTask (state, action) {
        return {
            ...state,
            byId: {
                ...state.byId,
                [action.newId]: {
                    id: action.newId,
                    task: 'Build a react app',
                    outcome: 'learn React',
                    desire: 'become a better developer',
                    done: false,
                },
            },
            allIds: [action.newId, ...state.allIds],
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
}), 'tasks');

function Tasks ({ tasks, onChange, newTask, clearAll }) {
    const todo = tasks.allIds.filter(task => !tasks.byId[task].done);
    const done = tasks.allIds.filter(task => tasks.byId[task].done);
    return (<div>
        <header>
            <H2>Hi, Dan 👋</H2>
            <Tagline>Let&apos;s get busy</Tagline>
            <Button onClick={newTask}>New task</Button>
            {(tasks.allIds.length) ? <Button negative onClick={clearAll}>Clear all</Button> : null}
        </header>
        {(todo.length) ?
            <div>
                <h3>To do</h3>
                <TaskList>
                    {todo.map(task => <Task
                      {...tasks.byId[task]}
                      taskId={task}
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
                newId: uuid(),
            });
        },
        clearAll () {
            dispatch({
                type: types.CLEAR_ALL,
            })
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
