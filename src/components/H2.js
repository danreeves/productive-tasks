import styled from 'styled-components';

export default styled.h2`
    color: ${props => props.colour || 'blue'};
    display: inline-block;
    margin-right: 0.5em;
`;
