function unescape(string, ...chars) {
	return chars.reduce((r, c) => r.replace('\\' + c, c), string);
}

function match(string, char) {
	return string.match(new RegExp(`(?:[^${char}\\\\]|\\\\.)+`, 'g'));
}

export default function parse(reference) {
	if(reference === '') return [];

	let rightPath = match(reference, '>');
	let leftPath = match(reference, '<');

	if(rightPath.length > 1 && leftPath.length > 1)
		throw new Error('Directions can not be mixed. Please choose right (>) or left (<) for your reference');

	let path;
	let scopeChar;

	if(rightPath.length >= leftPath.length) {
		path = rightPath;
		scopeChar = '>';
	}
	else {
		path = leftPath.reverse();
		scopeChar = '<';
	}

	return path.map(scope => {
		let scopeTarget = unescape(scope, '\\', scopeChar);

		return match(scopeTarget, '^').map(target => {
			let trimmedTarget = target.trim();
			let labelAndOptions = match(trimmedTarget, '#');

			return {
				label: trimmedTarget.indexOf('#') !== 0 ? unescape(labelAndOptions[0].trim(), '\\', '#') : '',
				options: labelAndOptions.slice(trimmedTarget.indexOf('#') !== 0 ? 1 : 0).map(o => {
					let lowercaseOption = o.trim().toLowerCase();
					if(isNaN(lowercaseOption))
						return lowercaseOption.replace(/[^0-9a-z]/g, '');
					else
						return parseInt(lowercaseOption);
				})
			};
		});
	});
}
