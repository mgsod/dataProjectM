/**
 * Created by setting on 2017/11/1 0001.
 * 开发环境
 */
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var baseConfig = require('./webpack.base');
var node_env = process.env.NODE_ENV;

var output = node_env === "development" ? baseConfig.dev.output : baseConfig.pro.output;
var entry = {
    "generalExport/projectList": __dirname + "/src/newProject/generalExport/js/projectList.js",
    "generalExport/createExport": __dirname + "/src/newProject/generalExport/js/createExport.js",
    "visualization/nodeDesk": __dirname + "/src/newProject/visualization/js/nodeDesk.js",
    "visualization/projectList": __dirname + "/src/newProject/visualization/js/projectList.js",
    "visualization/createProject": __dirname + "/src/newProject/visualization/js/createProject.js",
    "visualization/templateList": __dirname + "/src/newProject/visualization/js/templateList.js",
}
var config =  {
    entry: entry,
    output: output,
    externals: {
        jquery: 'window.$'
    },
    module: {
        loaders: [
            {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                loaders: 'style-loader!css-loader!sass-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/newProject/static',
                to: node_env === 'development' ? baseConfig.dev.copyTo : baseConfig.pro.copyTo,
                ignore: []
            }
        ]),

    ]
};
function getHtmlWebpackPluginOptions(name) {
    return node_env === 'development' ? baseConfig.dev.htmlOptions(name) : baseConfig.pro.htmlOptions(name)

}
for (var i in entry) {
    config.plugins.push(new HtmlWebpackPlugin(getHtmlWebpackPluginOptions(i)))
}
module.exports = config

