import postUtil from '../postUtil';

const mock = {
	post: postUtil
};

describe('Test for data posting function', () => {
	test('expect function to be called', async () => {
		const spy = jest.spyOn(mock, 'post');
		mock.post();
		expect(spy).toHaveBeenCalled();
	});
});
