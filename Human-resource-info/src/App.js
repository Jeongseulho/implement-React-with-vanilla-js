import Component from './core/Component.js';
import Header from './components/Header.js';
// import HomePage from './components/HomePage.js';

export default class App extends Component {
	template() {
		return /* html */ `
			<header></header>
			<main></main>
		`;
	}

	mounted() {
		const header = this.$target.querySelector('header');
		new Header(header, {
			changeUrl: this.changeUrl.bind(this),
		});

		const main = this.$target.querySelector('main');
		// new HomePage(main);
	}

	changeUrl(url) {
		window.history.pushState('', '', url);
		const urlChange = new CustomEvent('urlchange', {
			detail: { href: url },
		});
		document.dispatchEvent(urlChange);
	}
}
