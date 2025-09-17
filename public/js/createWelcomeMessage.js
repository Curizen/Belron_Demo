/*=========== welcome message =========== */
function createWelcomeMessage() {
	const chatBox = document.getElementById('chatBox');

	if (chatBox.children.length === 0) {
		const messageDiv = document.createElement('div');
		messageDiv.className =
			'bg-[#e9ecef] text-gray-700 px-3.5 py-2.5 rounded-2xl border border-gray-300 max-w-[75%] text-[14px] leading-[1.5] font-semibold shadow-xl relative';

		const iconDiv = document.createElement('div');
		iconDiv.className = 'absolute -top-4 -left-4';

		const iconImg = document.createElement('img');
		iconImg.className = 'w-8 h-auto';
		iconImg.src = '/images/logo-chatbot.png';
		iconImg.alt = 'icon';

		iconDiv.appendChild(iconImg);
		messageDiv.appendChild(iconDiv);

		const messageText = 'Hello! Welcome to CarGlass. How can I help you today?';
		messageDiv.innerHTML += messageText + '<br />';

		const now = new Date();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const timeSpan = document.createElement('span');
		timeSpan.className = 'text-[10px] text-[#777]';
		timeSpan.innerText = `${hours}:${minutes}`;

		messageDiv.appendChild(timeSpan);

		chatBox.appendChild(messageDiv);
	}
}

