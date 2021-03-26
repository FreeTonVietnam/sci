let path = require('path');

module.exports = Object({
    entry: {
        main: path.resolve(__dirname, './src/js/index.js'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        sourceMapFilename: "[name].js.map"
    },
    // performance: {
    //     hints: false
    // },
    // stats: 'errors-only',
    devServer: {
        clientLogLevel: 'info'
    },
    devtool: "source-map"
})