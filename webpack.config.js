const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = [
    {
        entry: {
            client: './src/client.js',
        },
        devtool: 'source-map',
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, 'dist', '/'),
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
            ],
        },
        plugins: [
            new ManifestPlugin({
                fileName: 'build-manifest.json',
            }),
            new StringReplacePlugin(),
            new CleanWebpackPlugin(['dist'], {
                verbose: false,
                exclude: ['server.js', 'build-manifest.json'],
            }),
            new FriendlyErrorsWebpackPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    },
    {
        entry: {
            server: './src/server.js',
        },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist', '/'),
            libraryTarget: 'commonjs2',
        },
        externals: [
            './build-manifest.json',
            nodeExternals({
                whitelist: [
                    /\.(eot|woff|woff2|ttf|otf)$/,
                    /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
                    /\.(mp4|mp3|ogg|swf|webp)$/,
                    /\.(css|scss|sass|less|styl)$/,
                ],
            }),
        ],
        performance: {
            hints: false,
        },
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
            // In order to provide sourcemaps, we automagically insert this at the
            // top of each file using the BannerPlugin.
            new webpack.BannerPlugin({
                raw: true,
                entryOnly: false,
                banner: `require('${
                  // Is source-map-support installed as project dependency, or linked?
                  (require.resolve('source-map-support').indexOf(process.cwd()) === 0)
                    // If it's resolvable from the project root, it's a project dependency.
                    ? 'source-map-support/register'
                    // It's not under the project, it's linked via lerna.
                    : require.resolve('source-map-support/register')
                }')`,
            }),
            new FriendlyErrorsWebpackPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
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
