import parse from './parse'

module.exports = function(reference) {
	if (typeof(reference) === 'string')
		return parse(reference);

	return JSON.parse(JSON.stringify(reference));
}