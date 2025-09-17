/* ========== delete chat ========== */
const newChatBtn = document.getElementById('newChatBtn');

newChatBtn.addEventListener('click', () => {
	localStorage.removeItem(CHAT_KEY);

	const chatBox = document.getElementById('chatBox');
	if (chatBox) {
		chatBox.innerHTML = '';
	}
	createWelcomeMessage();
	console.log('Chat storage fully cleared. No messages remain.');
});
