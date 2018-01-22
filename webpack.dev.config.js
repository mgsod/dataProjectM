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
    projectList: __dirname + "/src/newProject/generalExport/src/js/projectList.js",
    createExport: __dirname + "/src/newProject/generalExport/src/js/createExport.js",
    index: __dirname + "/src/newProject/node/src/js/index.js",
    list: __dirname + "/src/newProject/node/src/js/list.js",
    createProject: __dirname + "/src/newProject/node/src/js/createProject.js",
}
var config =  {
    entry: entry,
    output: output,
    externals: {
        jquery: 'window.$'
    },
    module: {
        loaders: [{
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
       /* new HtmlWebpackPlugin(getHtmlWebpackPluginOptions('projectList','generalExport')),
        new HtmlWebpackPlugin(getHtmlWebpackPluginOptions('createExport','generalExport')),
        new HtmlWebpackPlugin(getHtmlWebpackPluginOptions('index','node')),
        new HtmlWebpackPlugin(getHtmlWebpackPluginOptions('list','node')),
        new HtmlWebpackPlugin(getHtmlWebpackPluginOptions('createProject','node')),
        new webpack.HotModuleReplacementPlugin()*/

    ]
};
function getHtmlWebpackPluginOptions(project,name) {
    return node_env === 'development' ? baseConfig.dev.htmlOptions(name,project) : baseConfig.pro.htmlOptions(name,project)

}
var reg = /newProject\/(\w+)\//;
for (var i in entry) {
    config.plugins.push(new HtmlWebpackPlugin(getHtmlWebpackPluginOptions(entry[i].match(reg)[1],i)))
}
module.exports = config

