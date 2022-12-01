import Component from '../core/Component.js';
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
	}
}
