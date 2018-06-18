/**
 * Created by 昕点陈 on 2018/6/9.
 */
var path = require('path');

module.exports = {
entry: {
game: __dirname + "/app/main.js",
register: __dirname + "/app/register.js",
login: __dirname + "/app/login.js",
hall: __dirname + "/app/hall.js",
chooseCharacter: __dirname + "/app/chooseCharacter.js",

},
output: {
path: __dirname + "/public",
publicPath: '/',
filename: '[name]_bundle.js'
},

devServer: {
contentBase: "./public",
historyApiFallback: true,
inline: true,
host: '127.0.0.1',
compress: true,
port: 8888
},
//devtool: 'cheap-source-map',
//mode: 'development',
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
},
};