export default class SearchResult {
	state;

	constructor({ target, initialState }) {
		this.searchResult = document.createElement('section');
		this.searchResult.className = 'search-result';
		this.state = initialState;
		target.appendChild(this.searchResult);
	}

	setState(nextState) {
		this.state = nextState;
		this.render();
	}

	getCatImgTag(cat, idx) {
		return /* html */ `
			<div id=${idx} class="item">
				<img
					src=${cat.url}
					title=${cat.name}
					loading="lazy"
					alt=${cat.name}
					width="200"
					height="200"
				/>
			</div>
		`;
	}

	getNothingSearchResultTag(url) {
		return /* html */ `
    <div>
			<p>검색 결과가 없습니다.</p>
		</div>`;
	}

	get render() {
		const { getCatImgTag } = this;
		this.searchResult.innerHTML =
			this.state.length > 0
				? this.state.map((cat, idx) => getCatImgTag(cat, idx)).join('')
				: getNothingSearchResultTag;

		this.searchResult.addEventListener('click', (e) => {
			try {
				const itemId = e.target.closest('div').id;
				if (itemId) {
					this.onClick(this.state[itemId]);
				}
			} catch {
				return;
			}
		});
	}
}
