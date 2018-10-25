const path = require('path');
const webpack = require('webpack');
const vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.v2.rules;

module.exports = {
    // entry
    entry: path.resolve(__dirname, 'src/index.js'),
    // output
    output:{
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
    },
    module: {
        // loader
        rules:[
            { test: /\.html$/, loader: 'html-loader' }
        ].concat(vtkRules)
        // plugin
    },
    // mode 
    mode: 'development',
    // resolve: {
    //     module: path.resolve(__dirname, 'node_modules')
    // },
    devServer: {
        contentBase: path.resolve(__dirname, 'public')
    }
}