function handleRating(ratingStr) {
	addRatingCard();

	const storedRating = localStorage.getItem('chat_rating');
	const ratingValue = storedRating ? parseInt(storedRating) : null;

	if (ratingValue !== null) {
		const lastCard = chatBox.querySelector('.rating-card:last-child');
		if (lastCard) {
			const stars = lastCard.querySelectorAll('.star');
			const resultBox = lastCard.querySelector('.rating-result');
			const message = lastCard.querySelector('.rating-message');
			const score = lastCard.querySelector('.rating-score');

			stars.forEach((s, index) => {
				if (index < ratingValue) {
					s.classList.add('text-yellow-400');
					s.classList.remove('text-gray-300', 'text-red-500');
				} else {
					s.classList.add('text-red-500');
					s.classList.remove('text-gray-300', 'text-yellow-400');
				}
			});

			resultBox.classList.remove('hidden');
			message.textContent = '✅ Your rating has been submitted successfully';
			score.textContent = `⭐ Your rating: ${ratingValue} / 10`;
		}
	}
}
