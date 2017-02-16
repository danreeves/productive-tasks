import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
    * {
        box-sizing: border-box;
    }
    html,
    body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        background: #eee;
        font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;
    }
    button {
        font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;
    }
    a {
        color: red;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`;
