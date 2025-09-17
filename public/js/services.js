/* ===== services ===== */
servicesContainer.querySelectorAll('.service-btn').forEach((button) => {
	button.addEventListener('click', () => {
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
		const historyForBackend = getLastPairs(5);
		fetch('/analyze', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				message: userMessage,
				lang: currentLang,
				history: historyForBackend
			})
		})
			.then((res) => res.json())
			.then((data) => {
				typingIndicator.classList.add('hidden');
				addMessage(data.reply, 'bot');
				addConversationPair(userMessage, data.reply);
			})
			.catch((err) => {
				typingIndicator.classList.add('hidden');
				addMessage('Error connecting to server.', 'bot');
				console.error(err);
			});
	});
});
