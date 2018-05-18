module.exports = function(wallaby) {
	return {
		files: [
			{pattern: 'node_modules/chai/chai.js', instrument: false},
			'src/**/*.js',
			'!src/**/*-spec.js'
		],

		tests: [
			'src/**/*-spec.js'
		],

		compilers: {
			'**/*.js': wallaby.compilers.babel()
		},

		testFramework: 'mocha',

		env: {
			type: 'node',
			runner: 'node'
		},

		setup: function() {
			global.expect = chai.expect;
			chai.should();
		}
	};
};
