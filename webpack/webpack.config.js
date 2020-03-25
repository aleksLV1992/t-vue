var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports = {
    entry: '../js/config-vue.js',
    output: {
        path: path.resolve(__dirname, '../js/'),
        publicPath: '../js/',
        filename: 'components.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};