const path = require('path');
const webpack = require('webpack');
const vtkRules = require('vtk.js/Utilities/config/dependency.js');
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
            { test: path.resolve(__dirname, 'src/index.js'), loader: 'expose-loader?index' },
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
                            presets: ['@babel/preset-react'],
                        }
                    }
                ],
                include: path.resolve(__dirname, 'src')
            }
        // vtk configure.
        ].concat(vtkRules.webpack.core) 
    },
    plugins: [
        // copy necessary itk modules
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
                to: path.join(__dirname, 'public', 'itk', 'WebWorkers')
            },
            {
                from: path.join(__dirname, 'node_modules', 'itk', 'ImageIOs'),
                to: path.join(__dirname, 'public', 'itk', 'ImageIOs')
            },
            {
                from: path.join(__dirname, 'node_modules', 'itk', 'MeshIOs'),
                to: path.join(__dirname, 'public', 'itk', 'MeshIOs')
            }
        ])
    ],
    resolve: {
        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, './src'),
        ],
    },
    performance: {
        maxAssetSize: 10000000
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