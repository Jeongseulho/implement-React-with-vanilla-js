import Component from './core/Component.js';
import Items from './components/Items.js';
import ItemAppender from './components/ItemAppender.js';
import ItemFilter from './components/ItemFilter.js';
import { FILTER } from './constant.js';

export default class App extends Component {
	setup() {
		this.$state = {
			isFilter: FILTER.ALL,
			items: [
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
			],
		};
	}

	template() {
		return /* html */ `
      <header data-component="item-appender"></header>
      <main data-component="items"></main>
      <footer data-component="item-filter"></footer>
    `;
	}

	mounted() {
		// this.앞에 매번 안붙이도록 하기 위해 설정한 것
		const { filteredItems, addItem, deleteItem, toggleItem, filterItem } = this;
		const $itemAppender = this.$target.querySelector(
			'[data-component="item-appender"]',
		);
		const $items = this.$target.querySelector('[data-component="items"]');
		const $itemFilter = this.$target.querySelector(
			'[data-component="item-filter"]',
		);

		// 하나의 객체에서 사용하는 메소드를 넘겨줄 bind를 사용하여 this를 변경하거나,
		// 다음과 같이 새로운 함수를 만들어줘야 한다.
		// ex) { addItem: contents => addItem(contents) }
		new ItemAppender($itemAppender, {
			addItem: addItem.bind(this),
		});
		new Items($items, {
			filteredItems,
			deleteItem: deleteItem.bind(this),
			toggleItem: toggleItem.bind(this),
		});
		new ItemFilter($itemFilter, {
			filterItem: filterItem.bind(this),
		});
	}

	get filteredItems() {
		const { isFilter, items } = this.$state;
		return items.filter(
			({ active }) =>
				(isFilter === FILTER.ACTIVE && active) ||
				(isFilter === FILTER.IN_ACTIVE && !active) ||
				isFilter === FILTER.ALL,
		);
	}

	addItem(contents) {
		const { items } = this.$state;
		const seq = Math.max(0, ...items.map((v) => v.seq)) + 1;
		const active = false;
		this.setState({
			items: [...items, { seq, contents, active }],
		});
	}

	deleteItem(seq) {
		const items = [...this.$state.items];
		items.splice(
			items.findIndex((v) => v.seq === seq),
			1,
		);
		this.setState({ items });
	}

	toggleItem(seq) {
		const items = [...this.$state.items];
		const index = items.findIndex((v) => v.seq === seq);
		items[index].active = !items[index].active;
		this.setState({ items });
	}

	filterItem(isFilter) {
		this.setState({ isFilter });
	}
}
