import parse from './parser';

describe('Parsing', () => {
	it('should get label', () => {
		parse('label').should.deep.equal([[{label: 'label', options: []}]]);
	});

	it('should get index', () => {
		parse('label#10').should.deep.equal([[{label: 'label', options: ['10']}]]);
	});

	it('should support scopes', () => {
		parse('scope>label').should.deep.equal([[{label: 'scope', options: []}], [{
			label: 'label',
			options: []
		}]]);
	});

	it('should support option', () => {
		parse('label#text').should.deep.equal([[{label: 'label', options: ['text']}]]);
	});

	it('should escape option character', () => {
		parse('label\\#10').should.deep.equal([[{label: 'label#10', options: []}]]);
	});

	it('should support multiple options with pound', () => {
		parse('label #text #visible').should.deep.equal([[{
			label: 'label',
			options: ['text', 'visible']
		}]]);
	});

	it('should escape scope character', () => {
		parse('label\\>test').should.deep.equal([[{label: 'label>test', options: []}]]);
	});

	it('should escape the escape character', () => {
		parse('label\\\\test').should.deep.equal([[{
			label: 'label\\test',
			options: []
		}]]);
	});

	it('should support spaces before and after a label', () => {
		parse(' label ').should.deep.equal([[{label: 'label', options: []}]]);
	});

	it('should support spaces before and after a label between scopes', () => {
		parse(' label > label2 ').should.deep.equal([[{label: 'label', options: []}],
			[{label: 'label2', options: []}]]);
	});

	it('should support spaces before and after a label with options', () => {
		parse(' label#1 ').should.deep.equal([[{label: 'label', options: ['1']}]]);
	});

	it('should support intersecting labels', () => {
		parse(' label 1^label 2 ').should.deep.equal([[{label: 'label 1', options: []},
			{label: 'label 2', options: []}]]);
	});

	it('should support an empty subject', () => {
		parse('label >').should.deep.equal([[{label: 'label', options: []}]]);
	});

	it('should support an option only target', () => {
		parse('label > #option').should.deep.equal([
			[{
				label: 'label', options: []
			}],
			[{
				label: '', options: ['option']
			}]
		]);
	});
});

describe('Breadcrumb direction', () => {
	it('should support left to right', () => {
		parse('scope 1 > scope 2 > subject').should.deep.equal([
			[{label: 'scope 1', options: []}],
			[{label: 'scope 2', options: []}],
			[{label: 'subject', options: []}]
		]);
	});

	it('should support right to left', () => {
		parse('subject < scope 2 < scope 1').should.deep.equal([
			[{label: 'scope 1', options: []}],
			[{label: 'scope 2', options: []}],
			[{label: 'subject', options: []}]
		]);
	});

});

describe('Glace Parser: Syntax Errors', () => {
	it('should not throw an error for an empty string', () => {
		parse('').should.deep.equal([]);
	});

	it('should throw an error for >>', () => {
		expect(() => parse('aaa >>')).to.throw('Expected "#", "\\\\", or end of input but ">" found.');
	});

	it('should throw an error for mixed directions', () => {
		expect(() => parse('c < b > a')).to.throw('Expected "#", "<", "\\\\", "^", [ \\t\\r\\n], or end of input but ">" found.');
	});
});

describe('Preparsed data', () => {
	it('should return what was provided', () => {
		let data = parse('scope 1 > subject');
		parse(data).should.deep.equal(data);
	});
});