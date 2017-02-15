import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import '../global-styles';

import H1 from '../components/H1';

const AppWrapper = styled.div`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    @media (min-width: 400px) {
        width: 75%;
    }
`;

function App ({ children }) {
    return (<AppWrapper>
        <H1>🗒 Productive Tasks</H1>
        <div>{children}</div>
    </AppWrapper>);
}

export default connect(state => state)(App);
