import Component from './core/Component.js';
import Header from './components/Header.js';
import HomePage from './components/HomePage.js';
import SignUpPage from './components/SignUpPage.js';
import setPersonalInfo from './api/storage.js';

export default class App extends Component {
	setup() {
		setPersonalInfo();
	}

	template() {
		return /* html */ `
			<header></header>
			<main id="page_content"></main>
		`;
	}

	mounted() {
		const header = this.$target.querySelector('header');
		new Header(header, {
			changeUrl: this.changeUrl.bind(this),
		});

		const main = this.$target.querySelector('main');
		new HomePage(main);
	}

	changeUrl(url) {
		window.history.pushState('', '', url);
		const urlChange = new CustomEvent('urlchange', {
			detail: { href: url },
		});
		document.dispatchEvent(urlChange);
	}

	setEvent() {
		document.addEventListener('urlchange', (e) => {
			let pathname = e.detail.href;
			const main = this.$target.querySelector('main');

			switch (pathname) {
				case '/web/':
					new HomePage(main);
					break;
				case '/web/signup':
					new SignUpPage(main);
					break;
				default:
			}
		});
	}
}
