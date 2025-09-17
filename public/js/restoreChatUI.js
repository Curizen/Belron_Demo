function restoreChatUI() {
	const full = getFullConversation();
	full.forEach((pair) => {
		addMessage(pair.user, 'user');

		if (pair.bot.startsWith('RATING:')) {
			const storedRating = localStorage.getItem('chat_rating');
			const hasStored = storedRating !== null;
			const ratingValue = hasStored ? parseInt(storedRating) : null;

			addRatingCard();

			if (hasStored) {
				const lastCard = chatBox.querySelector('.rating-card:last-child');
				if (lastCard) {
					const stars = lastCard.querySelectorAll('.star');
					const resultBox = lastCard.querySelector('.rating-result');
					const message = lastCard.querySelector('.rating-message');
					const score = lastCard.querySelector('.rating-score');

					stars.forEach((s, index) => {
						if (index < ratingValue) {
							s.classList.remove('text-gray-300', 'text-red-500');
							s.classList.add('text-yellow-400');
						} else {
							s.classList.remove('text-gray-300', 'text-yellow-400');
							s.classList.add('text-red-500');
						}
					});

					resultBox.classList.remove('hidden');
					message.textContent = '✅ Your rating has been submitted successfully';
					score.textContent = `⭐ Your rating: ${ratingValue} / 10`;
				}
			}
		} else {
			addMessage(pair.bot, 'bot');
		}
	});
}
