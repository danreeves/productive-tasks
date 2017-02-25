import path from 'path';
import serialize from 'serialize-javascript';

const manifest = require('./build-manifest.json');

export default function HTML ({ html, styles, initialState }) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <!-- The first thing in any HTML file should be the charset -->
                <meta charset="utf-8">
                <!-- Make the page mobile compatible -->
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <!-- Allow installing the app to the homescreen -->
                <link rel="manifest" href="manifest.json">
                <meta name="mobile-web-app-capable" content="yes">

                <title>Productive Tasks</title>
                <style id="ssr-styles" type="text/css">${styles}</style>
                <noscript>
                    <style type="text/css">
                        button {
                            display: none;
                        }
                    </style>
                </noscript>
            </head>
            <body>
                <div id="root">${html}</div>
                <script>window.$$initialState = ${serialize(initialState, { isJSON: true })};</script>
                <script src="/${manifest['client.js']}"></script>
            </body>
        </html>
    `;
}
