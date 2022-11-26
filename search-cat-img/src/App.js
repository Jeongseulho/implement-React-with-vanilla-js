import fetchCat from './api/fetchCat.js';
import Header from './components/Header.js';

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

		const { genRandomImg } = this;

		new Header({ target, genRandomImg: genRandomImg.bind(this) });
	}

	async genRandomImg() {
		const catImg = await fetchCat.randomImg();
		this.searchResult.setState(catImg[0]);
	}
}
