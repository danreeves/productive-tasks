import React from 'react';
import styled from 'styled-components';

const LI = styled.li`
    background: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 1px #999;

    width: 32%;
    margin-bottom: 1em;
    padding: 1.5em;

    color: #000;
`;

const Line = styled.span`
    display: block;
    width: 100%;
    line-height: 1.5em;
    margin-bottom: 0.5em;
`;
const B = styled.span`
    color: #666;
    font-size: 0.9em;
`;

export default ({ task, outcome, desire }) => (<LI>
    <Line>{task}</Line>
    <Line><B>in order to </B>{outcome}</Line>
    <Line><B>because I want to </B>{desire}</Line>
</LI>);
