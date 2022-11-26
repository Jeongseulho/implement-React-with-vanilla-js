import fetchCat from './api/fetchCat.js';

export default class App {
	state;
	target;

	constructor(target) {
		this.target = target;
		this.state = {
			visible: false,
			image: null,
			data: [],
		};
	}
}
