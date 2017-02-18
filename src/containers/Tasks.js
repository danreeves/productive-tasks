import React from 'react';
import { connect } from 'react-redux';
import createReducer from '../util/create-reducer';

import TaskList from '../components/TaskList';
import Task from '../components/Task';
import H2 from '../components/H2';
import Tagline from '../components/Tagline';
import Button from '../components/Button';

const types = {
    ADD_TASK: 'ADD_TASK',
    UPDATE_TASK: 'UPDATE_TASK',
};

const initialState = {
    byId: {},
    allIds: [],
};

export const reducer = createReducer(initialState, {
    [types.ADD_TASK]: function addTask (state, action) {
        console.log('> State', state);
        return {
            ...state,
            byId: {
                ...state.byId,
                [action.task.id]: action.task,
            },
            allIds: [action.task.id, ...state.allIds],
        };
    },
    [types.UPDATE_TASK]: function updateTask (state, action) {
        console.log('> State', state);
        console.log('> Action', action);
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
});

function Tasks ({ tasks, onChange, newTask }) {
    return (<div>
        <header>
            <H2>Hi, Dan 👋</H2>
            <Tagline>Let&apos;s get busy</Tagline>
            <Button onClick={newTask}>New task</Button>
        </header>
        <TaskList>
            {tasks.allIds.map(task => <Task
              taskId={task}
              task={tasks.byId[task].task}
              outcome={tasks.byId[task].outcome}
              desire={tasks.byId[task].desire}
              onChange={onChange}
            />)}
        </TaskList>
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
                task: {
                    id: Math.floor(Math.random().toFixed(5) * 100000),
                    task: 'Build a react app',
                    outcome: 'learn React',
                    desire: 'become a better developer',
                },
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
