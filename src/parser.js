import parse from './parse';

module.exports = function(reference, config) {
	if(typeof (reference) === 'string')
		return parse(reference, config);

	return JSON.parse(JSON.stringify(reference));
};