import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import createReducer from '../util/create-reducer';

import TaskList from '../components/TaskList';
import Task from '../components/Task';
import H2 from '../components/H2';
import Tagline from '../components/Tagline';

const types = {
    ADD_TASK: 'ADD_TASK',
};

const initialState = {
    byId: {},
    allIds: [],
};

export const reducer = createReducer(initialState, {
    [types.ADD_TASK]: function addTask (state, action) {
        return {
            ...state,
            tasks: {
                byId: {
                    [action.task.id]: action.task,
                    ...state.tasks,
                },
                allIds: [action.task.id, ...state.tasks.allIds],
            },
        };
    },
});

function Tasks ({ tasks }) {
    return (<div>
        <header>
            <H2>Hi, Dan 👋</H2>
            <Tagline>Let&apos;s get busy</Tagline>
        </header>
        <TaskList>
            {tasks.allIds.map(task => <Task props={tasks.byId[task]} />)}
            <Task
              task="Do a thing"
              outcome="have done a thing that is a bit longer"
              desire="do more things"
            />
        </TaskList>
    </div>);
}

function mapStateToProps (state) {
    return {
        tasks: state.tasks,
    };
}

export default connect(mapStateToProps)(Tasks);
