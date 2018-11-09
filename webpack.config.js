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
        rules:[
            // html loader
            { 
                test: /\.html$/, 
                use: [
                    { loader: 'html-loader' }
                ],
                include: path.resolve(__dirname, 'src')
            },
            // css style loader
            {
                test: /\.css$/,
                use:[
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ],
                include: path.resolve(__dirname, 'src')
            },
            // babel-loader
            {
                test: /\.js$/,
                use:[
                    {
                        loader: 'babel-loader',
                        options: {
                            // presets: ['babel/preset-react'],
                            // plugins: [
                            //     '@babel/plugin-syntax-dynamic-import',
                            //     '@babel/plugin-transform-runtime'
                            // ]
                        }
                    }
                ],
                include: path.resolve(__dirname, 'src')
            }


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