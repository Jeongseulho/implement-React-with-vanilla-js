import App from '../src/App';
import jsdom from '../../node_modules/jsdom';

describe('App test', () => {
	test('should', () => {
		const { JSDOM } = jsdom;
		const dom = new JSDOM(/* html */ `
			<div id="app"></div>
		`);

		const app = new App(dom.window.document.querySelector('#app'));

		app.addItem('test');
		const result = app.$state.items;

		expect(result).toEqual([
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
			{
				seq: 3,
				contents: 'test',
				active: false,
			},
		]);
	});
});
