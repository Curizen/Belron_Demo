/* ===== Sending Messages ===== */
async function sendMessage() {
	const userMessage = messageInput.value.trim();
	if (!userMessage) return;

	addMessage(userMessage, 'user');
	messageInput.value = '';

	typingIndicator.classList.remove('hidden');
	chatBox.appendChild(typingIndicator);
	chatBox.scrollTop = chatBox.scrollHeight;

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

		let botReplyToStore = '';

		const { rating, output } = data;

		if (rating === 'null') {
			addRatingCard();
			botReplyToStore = 'RATING:null';
		} else if (rating === 'booking') {
			if (output) {
				addMessage(output, 'bot');
			}
			addRatingCard();
			botReplyToStore = `RATING:booking`;
		} else {
			if (output) {
				if (typeof output === 'string') {
					addMessage(output, 'bot');
					botReplyToStore = output;
				} else if (typeof output === 'object') {
					addMessage(output, 'bot');
					botReplyToStore = JSON.stringify(output);
				}
			}
		}

		addConversationPair(userMessage, botReplyToStore);
	} catch (err) {
		typingIndicator.classList.add('hidden');
		addMessage('Error connecting to server.', 'bot');
		console.error(err);
	}
}
