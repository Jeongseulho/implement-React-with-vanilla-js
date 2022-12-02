import Component from '../core/Component.js';
import Card from './Card.js';
import ContentTitle from './ContentTitle.js';

export default class HomePage extends Component {
	template() {
		return /* html */ `
			<div class="content_title"></div>
			<div id="cards_container"></div>
		`;
	}

	mounted() {
		const content_title = this.$target.querySelector('.content_title');
		new ContentTitle(content_title);

		const cards_container = this.$target.querySelector('#cards_container');
		new Card(cards_container);
	}
}
