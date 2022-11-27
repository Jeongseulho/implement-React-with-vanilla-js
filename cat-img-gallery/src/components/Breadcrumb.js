export default class Breadcrumb {
	$target;
	$state;

	constructor({ $app, initialState }) {
		this.$state = initialState;
		this.$target = document.createElement('nav');
		this.$target.className = 'Breadcrumb';
		$app.appendChild(this.$target);
	}

	setState(nextState) {
		this.$state = nextState;
		this.render();
	}

	render() {
		this.$target.innerHTML = /* html */ ` <div class="nav-item">root</div>
			${this.state
				.map(
					(node, index) => /* html */ `
                <div class="nav-item" data-index="${index}">${node.name}</div>
            `,
				)
				.join('')}`;
	}
}
