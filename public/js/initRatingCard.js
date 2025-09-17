function initRatingCard(wrapper) {
	const stars = wrapper.querySelectorAll('.star');
	const resultBox = wrapper.querySelector('.rating-result');
	const message = wrapper.querySelector('.rating-message');
	const score = wrapper.querySelector('.rating-score');

	let selectedValue = 0;
	let sessionIP = 'unknown';

	fetch('https://api.ipify.org?format=json')
		.then((res) => res.json())
		.then((data) => (sessionIP = data.ip))
		.catch((err) => console.error('Failed to get IP:', err));

	const storedRating = localStorage.getItem('chat_rating');
	if (storedRating) {
		selectedValue = parseInt(storedRating);
		paintStars(selectedValue);
		resultBox.classList.remove('hidden');
		message.textContent = '✅ Your rating has been submitted successfully';
		score.textContent = `⭐ Your rating: ${selectedValue} / 10`;
	}

	function paintStars(value) {
		stars.forEach((s, index) => {
			if (index < value) {
				s.classList.remove('text-gray-300', 'text-red-500');
				s.classList.add('text-yellow-400');
			} else {
				s.classList.remove('text-gray-300', 'text-yellow-400');
				s.classList.add('text-red-500');
			}
		});
	}

	stars.forEach((star) => {
		star.addEventListener('mouseenter', () => paintStars(parseInt(star.dataset.value)));
		star.addEventListener('mouseleave', () => paintStars(selectedValue));

		star.addEventListener('click', () => {
			selectedValue = parseInt(star.dataset.value);
			paintStars(selectedValue);

			resultBox.classList.remove('hidden');
			message.textContent = '✅ Your rating has been submitted successfully';
			score.textContent = `⭐ Your rating: ${selectedValue} / 10`;

			localStorage.setItem('chat_rating', selectedValue);

			sendRating(selectedValue, sessionIP);
		});
	});
}
