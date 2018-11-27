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
        rules: [
            {
                test: path.resolve(__dirname, 'src/index.js'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'index'
                    }
                ]
            },
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
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ],
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.xml$/,
                use:[
                    {loader: 'xml-loader'}
                ],
                include: path.resolve(__dirname, 'src')
            },
            // babel-loader
            {
                test: /\.js$/,
                use: [
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
                to: path.join(__dirname, 'build', 'itk', 'WebWorkers')
            },
            {
                from: path.join(__dirname, 'node_modules', 'itk', 'ImageIOs'),
                to: path.join(__dirname, 'build', 'itk', 'ImageIOs')
            },
            {
                from: path.join(__dirname, 'node_modules', 'itk', 'MeshIOs'),
                to: path.join(__dirname, 'build', 'itk', 'MeshIOs')
            }
        ])
    ],
    performance: {
        maxAssetSize: 10000000
    },
    // mode 
    mode: 'development',
    // resolve: {
    //     module: path.resolve(__dirname, 'node_modules')
    // },
    devServer: {
        contentBase: [
            path.resolve(__dirname, 'public'),
            // 'C:/Users/jieji/Desktop'
        ],
        // auto open
        open: true
    }
}