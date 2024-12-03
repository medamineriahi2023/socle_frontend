// extra-webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.bpmn$/,
                use: 'raw-loader'
            }
        ]
    }
};
