var path = require('path');

module.exports = {
    entry: './src/common/index.less',
    output: {
        filename: 'tmp.js',
        path: path.resolve(__dirname, './src/styles')
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: [
                {
                    loader: 'react-native-style-loader'
                },
                {
                    loader: 'less-loader'
                }
            ]
        }]
    }
};