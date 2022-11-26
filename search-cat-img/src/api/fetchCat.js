const API_END_POINT =
	'https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev';

const handleError = () => {
	window.alert(`api 서버 오류입니다. 확인 버튼을 누르면 새로고침합니다.`);
	location.reload();
};

async function fetchApi(url) {
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error('에러 발생');
		return await res.json();
	} catch (error) {
		handleError();
	}
}

const fetchCat = {
	searched(keyword) {
		fetchApi(`${API_END_POINT}/api/cats/search?q=${keyword}`);
	},

	randomImg() {
		fetchApi(`${API_END_POINT}/api/cats/random50`);
	},

	info(catId) {
		fetchApi(`${API_END_POINT}/api/cats/${catId}`);
	},
};

export default { fetchCat };
