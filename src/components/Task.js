import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ContentEditable from 'react-contenteditable';

import Button from './Button';

const LI = styled.li`
    background: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 1px #999;

    width: 31.3%;
    margin: 1%;
    padding: 1.5em;

    color: #000;
`;

const Line = styled.span`
    display: block;
    width: 100%;
    line-height: 1.5em;
    margin-bottom: 0.5em;
`;
const B = styled.em``;
const Input = styled(ContentEditable)`
    display: ${props => (!props.html ? 'inline-block' : 'inline')};
    border-bottom: ${props => (props.disabled ? 'none' : '1px dashed #ccc')};
    color: ${props => (props.disabled ? 'inherit' : '#ccc')};
    word-wrap: break-word;
`;


class Task extends Component {
    constructor (props) {
        super(props);
        // Initial state
        this.state = {
            editing: false,
        };
        // Method bindings
        this.toggleEditing = this.toggleEditing.bind(this);
        this.doubleClickEdit = this.doubleClickEdit.bind(this);
        this.markDone = this.markDone.bind(this);

        // Updates
        this.onChange = (key) => {
            return (e) => {
                this.props.onChange({
                    task: this.props.taskId,
                    update: {
                        [key]: e.target.value,
                    },
                });
            };
        };
    }


    toggleEditing () {
        this.setState(prev => ({
            editing: !prev.editing,
        }));
    }

    doubleClickEdit () {
        if (!this.state.editing) {
            this.toggleEditing();
        }
    }

    markDone () {
        this.onChange('done')({
            target: {
                value: true,
            },
        });
    }


    render () {
        const { task, outcome, desire, done } = this.props;
        const { editing } = this.state;

        const Todo = (<Line>
            <Input
              disabled={!editing}
              html={task}
              onChange={this.onChange('task')}
              onDoubleClick={this.doubleClickEdit}
            />
        </Line>);

        const Outcome = (<Line>
            <B>in order to </B>
            <Input
              disabled={!editing}
              html={outcome}
              onChange={this.onChange('outcome')}
              onDoubleClick={this.doubleClickEdit}
            />
        </Line>);

        const Desire = (<Line>
            <B>because I want to </B>
            <Input
              disabled={!editing}
              html={desire}
              onChange={this.onChange('desire')}
              onDoubleClick={this.doubleClickEdit}
            />
        </Line>);

        return (<LI>
            {Todo}
            {Outcome}
            {Desire}
            {(done) ? null : <div>
                <Button small onClick={this.toggleEditing}>{(editing) ? 'Save' : 'Edit'}</Button>
                {(editing) ? null : <Button small negative onClick={this.markDone}>Done</Button>}
            </div>}
        </LI>);
    }
}

export default Task;
