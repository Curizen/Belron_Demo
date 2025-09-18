/* ===== Service Buttons Handling ===== */
servicesContainer.querySelectorAll('.service-btn').forEach((button) => {
	button.addEventListener('click', async () => {
		const serviceName = currentLang === 'en' ? button.dataset.serviceEn : button.dataset.serviceDe;
		const userMessage =
			currentLang === 'en'
				? `I want to know more about ${serviceName}`
				: `Ich möchte mehr über ${serviceName} erfahren`;

		addMessage(userMessage, 'user');

		typingIndicator.classList.remove('hidden');
		chatBox.appendChild(typingIndicator);
		chatBox.scrollTop = chatBox.scrollHeight;

		sidebar.classList.add('-translate-x-full');

		try {
			const historyForBackend = getLastPairs(5);
			const response = await fetch('/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: userMessage,
					lang: currentLang,
					history: historyForBackend
				})
			});

			const data = await response.json();
			typingIndicator.classList.add('hidden');

			let botReply = '';
			const { rating, output } = data;
			let botRating = null;

			if (rating === 'null') {
				addRatingCard();
				botReply = null;
				botRating = 'null';
			} else if (rating === 'booking') {
				if (output) addMessage(output, 'bot');
				addRatingCard();
				botReply = output;
				botRating = 'booking';
			} else {
				if (output) {
					if (typeof output === 'string') {
						addMessage(output, 'bot');
						botReply = output;
					} else if (typeof output === 'object') {
						addPersonInfo(output, 'bot');
						botReply = output;
					}
				}
			}

			addConversationPair(userMessage, botReply, botRating);

		} catch (err) {
			typingIndicator.classList.add('hidden');
			addMessage('Error connecting to server.', 'bot');
			console.error(err);
		}
	});
});
