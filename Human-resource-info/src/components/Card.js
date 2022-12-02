import Component from '../core/Component.js';

export default class Card extends Component {
	template() {
		const personalInfo = JSON.parse(localStorage.getItem('personalInfo'));

		return `
    ${personalInfo
			.map(
				(person, idx) => /* html */ `
				<div idx="${idx}" class="card">
					<div class="card_plane card_plane--front">${person.name}</div>
					<div class="card_plane card_plane--back">${person.mbti}</div>
				</div>
			`,
			)
			.join('')}	
		`;
	}
}
