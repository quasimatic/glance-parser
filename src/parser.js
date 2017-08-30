import parser from '../lib/peg-parser';

module.exports = function(reference) {
	if (typeof(reference) === 'string')
		return parser.parse(reference);

	return JSON.parse(JSON.stringify(reference));
}