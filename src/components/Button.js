import styled from 'styled-components';

export default styled.button`
    appearance: none;
    border: 0;
    background: none;
    font-size: ${props => (
        (props.small) ? '0.75em' : '1em'
    )};
    border-radius: 5px;
    border: 2px solid ${props => (
            (props.positive) ? 'green' :
            (props.neutral) ? 'blue' :
            (props.negative) ? 'red' : 'green'
        )
    };
    color: ${props => (
            (props.positive) ? 'green' :
            (props.neutral) ? 'blue' :
            (props.negative) ? 'red' : 'green'
        )
    };

    margin-left: 0.5em;
    &:first-of-type {
        margin-left: 0;
    }
`;
