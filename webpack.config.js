/*
eslint import/no-extraneous-dependencies: 0
 */
const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const pkg = require('./package.json');

module.exports = [
    {
        entry: {
            client: './src/client.js',
        },
        devtool: 'source-map',
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, 'dist'),
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: [
                            [
                                'env',
                                {
                                    modules: false,
                                    browsers: [
                                        'last 2 versions',
                                        'safari 8',
                                        'not ie <= 10',
                                    ],
                                },
                            ],
                            'react',
                        ],
                        plugins: [
                            'transform-object-rest-spread',
                        ],
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                },
                {
                    test: /firebase/,
                    loader: StringReplacePlugin.replace({
                        replacements: [
                            {
                                pattern: /"process"/ig,
                                replacement () {
                                    return '"thisisnotdefinedok"';
                                },
                            },
                        ],
                    }),
                },
            ],
        },
        plugins: [
            new ManifestPlugin({
                fileName: 'build-manifest.json',
            }),
            new StringReplacePlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
        ],
    },
    {
        entry: {
            server: ['babel-polyfill', './src/server.js'],
        },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist'),
            libraryTarget: 'commonjs2',
        },
        externals: Object.keys(pkg.dependencies).concat([{'styled-components/lib/models/StyleSheet': 'commonjs styled-components/lib/models/StyleSheet'}]),
        target: 'node',
        devtool: 'inline-source-map',
        node: {
            console: false,
            process: false,
            global: false,
            Buffer: false,
            setImmediate: false,
            __filename: false,
            __dirname: false,
        },
        plugins: [
            new webpack.IgnorePlugin(/vertx/),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: [
                            ['env', { modules: false, node: 'current' }],
                            'react',
                        ],
                        plugins: [
                            'transform-object-rest-spread',
                        ],
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                },
            ],
        },
    },
];
