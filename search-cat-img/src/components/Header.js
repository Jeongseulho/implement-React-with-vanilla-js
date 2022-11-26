export default class Header {
	constructor({ target, genRandomImg }) {
		this.header = document.createElement('header');
		target.appendChild(this.header);
		this.onClick = genRandomImg;
		this.render();
	}

	render() {
		this.header.innerHTML = /* html */ `
    <button class="random-img">Random cat img</button>
    `;

		this.header.addEventListener('click', (e) => {
			if (e.target.className === 'random-img') {
				this.onClick();
			}
		});
	}
}
