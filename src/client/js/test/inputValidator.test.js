import inputValidator from '../inputValidator';

describe('Input validation test', () => {
	test('Expect function to return error with invalid input', () => {
		const { error } = inputValidator(null);
		expect(error).toBe('No value inputed');
	});
	test('Expect function to return formmated for valid input', () => {
		const { formatted } = inputValidator('Hey, I hate alcohol');
		expect(formatted).toHaveProperty('text', 'Hey, I hate alcohol');
		// should not have url property since content does not have url
		expect(formatted).not.toHaveProperty('url');
	});
	test('Expect function to match url patter and provide a key url', () => {
		const { formatted } = inputValidator(
			'https://udacity.com/classroom  this is some random text'
		);
		expect(formatted).toHaveProperty(
			'url',
			'https://udacity.com/classroom'
		);
		expect(formatted).toHaveProperty('text', '  this is some random text');
	});
});
