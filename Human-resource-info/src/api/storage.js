export default async function setPersonalInfo() {
	const response = await fetch('/Human-resource-info/src/data/new_data.json');
	const data = await response.json();

	if (!localStorage.getItem('personalInfo')) {
		localStorage.setItem('personalInfo', JSON.stringify(data));
	}
}
