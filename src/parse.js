RegExp.escape = function(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function unescape(string, escapeChar, ...chars) {
	return chars.reduce((r, c) => r.replace(escapeChar + c, c), string);
}

function match(string, char, escapeChar) {
	return string.match(new RegExp(`(?:[^${RegExp.escape(char)}${RegExp.escape(escapeChar)}]|${RegExp.escape(escapeChar)}.)+`, 'g')) || ['']
}

function options(target, optionChar, escapeChar) {
	let labelAndOptions = match(target, optionChar, escapeChar);

	return {
		label: target.indexOf(optionChar) !== 0 ? unescape(labelAndOptions[0].trim(), escapeChar, escapeChar, optionChar) : '',
		options: labelAndOptions.slice(target.indexOf(optionChar) !== 0 ? 1 : 0).map(o => {
			let lowercaseOption = o.trim().toLowerCase();
			if(isNaN(lowercaseOption))
				return lowercaseOption.replace(/[^0-9a-z]/g, '');
			else
				return parseInt(lowercaseOption);
		})
	};
}

export default function parse(reference, config = {}) {
	let scopeRight = config.scopeRight || '>';

	let supportsScopeLeft = config.scopeLeft === null || (config.scopeLeft !== false);
	let scopeLeft = supportsScopeLeft ? config.scopeLeft || '<' : null;

	let escapeChar = config.escape || '\\';
	let optionChar = config.option || '#';
	let intersectChar = config.intersect || '^';

	let rightPath = match(reference, scopeRight, escapeChar);

	let path = rightPath;
	let scopeChar = scopeRight;

	if(supportsScopeLeft) {
		if(scopeLeft === escapeChar)
			throw new Error(`scopeLeft (${scopeLeft}) cannot be the same character as escape (${escapeChar})`);

		let leftPath = match(reference, scopeLeft, escapeChar);

		if(rightPath.length > 1 && leftPath.length > 1)
			throw new Error(`Directions can not be mixed. Please choose right (${scopeRight}) or left (${scopeLeft}) for your reference`);

		if(rightPath.length < leftPath.length) {
			path = leftPath.reverse();
			scopeChar = scopeLeft;
		}
	}

	return path.map(scope => {
		let scopeTarget = unescape(scope, escapeChar, escapeChar, scopeChar);

		return match(scopeTarget, intersectChar, escapeChar).map(target => {
			let trimmedTarget = target.trim();
			return options(trimmedTarget, optionChar, escapeChar);

		});
	});
}
