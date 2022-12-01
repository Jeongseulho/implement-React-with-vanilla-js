import Component from './core/Component.js';
import Header from './components/Header.js';

export default class App extends Component {
	mounted() {
		new Header(this.$target);
	}
}
