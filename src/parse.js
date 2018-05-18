export default function parse(reference) {
	if(reference === '') return [];

	let rightPath = reference.match(/(?:[^>\\]|\\.)+/g);
	let leftPath = reference.match(/(?:[^<\\]|\\.)+/g);

	if(rightPath.length > 1 && leftPath.length > 1)
		throw new Error("Directions can not be mixed. Please choose right (>) or left (<) for your reference");

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

	return path.map(s => {
		let scopeTarget = s.replace('\\\\', '\\').replace('\\' + scopeChar, scopeChar);

		return scopeTarget.match(/(?:[^^\\]|\\.)+/g).map(target => {
			let labelAndOptions = target.trim().match(/(?:[^#\\]|\\.)+/g);

			return {
				label: target.trim().indexOf('#') !== 0 ? labelAndOptions[0].replace('\\\\', '\\').replace('\\#', '#').trim() : '',
				options: target.trim().indexOf('#') !== 0 ? labelAndOptions.slice(1).map(o => o.trim()) : labelAndOptions.map(o => o.trim())
			};
		});
	});
}
