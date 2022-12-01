import Component from '../core/Component.js';

export default class Header extends Component {
	template() {
		return /* html */ `
			<header>
				<div class="header header_left">
					<span class="menu_name" id="menu_home">Home</span>
				</div>
				<div class="header header_right">
					<span class="menu_name" id="menu_signup">SIGN UP</span>
				</div>
			</header>
		`;
	}
}
