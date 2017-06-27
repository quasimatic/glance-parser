var wallabyWebpack = require('wallaby-webpack');

module.exports = function (wallaby) {
    var webpackPostprocessor = wallabyWebpack({
        module: {
            loaders: [
                {
                    test: /.js?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        }
    });
    return {
        files: [
            {pattern: 'node_modules/chai/chai.js', instrument: false},

            {pattern: 'lib/**/*.js', load: false},
            {pattern: '!**/*-spec.js', load: false},
        ],

        tests: [
            {pattern: '**/*-spec.js', load: false},
        ],

        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },

        postprocessor: webpackPostprocessor,

        testFramework: 'mocha',

        setup: function () {
            window.expect = chai.expect;
            chai.should();

            window.__moduleBundler.loadTests();
        }
    };
};
