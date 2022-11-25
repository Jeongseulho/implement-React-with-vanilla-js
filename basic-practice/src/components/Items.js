import Component from '../core/Component.js';

export default class Items extends Component {
	getList(seq, contents, active) {
		return `
          <li data-seq="${seq}">
            ${contents}
            <button class="toggleBtn" style="color: ${
							active ? '#09F' : '#F09'
						}">
              ${active ? '활성' : '비활성'}
            </button>
            <button class="deleteBtn">삭제</button>
          </li>
        `;
	}

	template() {
		const { filteredItems } = this.$props;
		return `
      <ul>
        ${filteredItems
					.map(({ contents, active, seq }) =>
						this.getList(seq, contents, active),
					)
					.join('')}
      </ul>
    `;
	}

	getTargetSeq(target) {
		return target.closest('[data-seq]').dataset.seq;
	}

	setEvent() {
		const { deleteItem, toggleItem } = this.$props;

		this.addEvent('click', '.deleteBtn', ({ target }) => {
			deleteItem(Number(this.getTargetSeq(target)));
		});

		this.addEvent('click', '.toggleBtn', ({ target }) => {
			toggleItem(Number(this.getTargetSeq(target)));
		});
	}
}
