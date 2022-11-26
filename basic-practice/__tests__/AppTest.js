import App from '../src/App';

describe('App test', () => {
	const container = document.createElement('div').setAttribute('id', 'app');
	document.body.appendChild(container);
	const app = new App('#app');

	test('test1', () => {
		expect(app.filterItem()).toEqual([
			{
				seq: 1,
				contents: 'item1',
				active: false,
			},
			{
				seq: 2,
				contents: 'item2',
				active: true,
			},
		]);
	});
});
