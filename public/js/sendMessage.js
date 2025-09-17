/* ===== Sending Messages ===== */
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') sendMessage();
});

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
}


