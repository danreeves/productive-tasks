const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
        externals: [
            'crypto',
        ],
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
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            new CleanWebpackPlugin(['dist'], {
                verbose: false,
                exclude: ['server.js', 'build-manifest.json'],
            }),
            new FriendlyErrorsWebpackPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true,
                },
                compress: {
                    screw_ie8: true,
                },
                comments: false,
                sourceMap: true,
            }),
            new BundleAnalyzerPlugin(),
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
            nodeExternals(),
        ],
        target: 'node',
        devtool: 'source-map',
        stats: 'none',
        profile: false,
        performance: {
            hints: false,
        },
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
                banner: `if (process.env.NODE_ENV === 'development') require('${
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
