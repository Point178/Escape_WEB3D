const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        game: "./app/main.js",
        register: "./app/register.js",
        login: "./app/login.js",
        hall: "./app/hall.js",
        chooseCharacter: "./app/chooseCharacter.js"
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Production'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
// 图片加载器
                test: /\.(png|jpg|gif|jpeg)$/,
                loader: 'url-loader?limit=2048'
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};