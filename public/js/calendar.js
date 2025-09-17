const monthSelect = document.getElementById('month-select');
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];
const currentMonth = new Date().getMonth();
months.forEach((month, index) => {
	const opt = document.createElement('option');
	opt.value = index;
	opt.textContent = month;
	if (index === currentMonth) opt.selected = true;
	monthSelect.appendChild(opt);
});

const daysGrid = document.getElementById('days-grid');
const timesContainer = document.createElement('div');
timesContainer.className = 'flex flex-col gap-4 mt-3';
daysGrid.after(timesContainer);

let selectedDate = null;

function generateDays(monthIndex) {
	daysGrid.innerHTML = '';
	timesContainer.innerHTML = '';
	const today = new Date();
	const year = today.getFullYear();
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

	for (let i = 1; i <= daysInMonth; i++) {
		const day = document.createElement('div');
		day.textContent = i;
		day.className =
			'flex items-center justify-center text-center rounded-lg w-9 h-9 my-auto text-[14px] font-medium transition border border-[#ddd]';

		const currentDate = new Date(year, monthIndex, i);

		if (currentDate < today.setHours(0, 0, 0, 0)) {
			day.classList.add('bg-red-200', 'text-gray-500', 'cursor-not-allowed', 'opacity-50');
			day.title = 'Past Date';
		} else {
			const rand = Math.random();
			if (rand < 0.2) {
				day.classList.add('bg-red-600', 'text-white', 'cursor-not-allowed');
				day.title = 'Not Available';
			} else if (rand < 0.5) {
				day.classList.add('bg-gray-300', 'text-[#333]', 'cursor-pointer', 'hover:bg-gray-400');
				day.title = 'Few Slots Available';
			} else {
				day.classList.add('bg-white', 'text-[#333]', 'cursor-pointer', 'hover:bg-gray-100');
				day.title = 'Available';
			}
		}

		daysGrid.appendChild(day);
	}
}

generateDays(new Date().getMonth());
monthSelect.addEventListener('change', (e) => generateDays(parseInt(e.target.value)));
function generateTimes() {
	timesContainer.innerHTML = '';
	const possibleTimes = [
		'01:00 PM - 2:15 PM',
		'02:30 PM - 3:45 PM',
		'04:00 PM - 5:15 PM',
		'05:30 PM - 6:45 PM',
		'07:00 PM - 8:15 PM'
	];

	possibleTimes.forEach((time) => {
		const rand = Math.random();
		let bgClass = 'bg-white text-[#333] hover:bg-gray-100 cursor-pointer';
		if (rand < 0.2) bgClass = 'bg-red-600 text-white cursor-not-allowed opacity-70';
		else if (rand < 0.5) bgClass = 'bg-gray-300 text-[#333] hover:bg-gray-400 cursor-pointer';

		const p = document.createElement('p');
		p.textContent = time;
		p.className = `text-center w-full border-b border-r border-red-700 rounded-xl py-2 shadow-xl transform transition duration-200 hover:scale-105 hover:shadow-2xl flex items-center justify-between px-6 ${bgClass}`;

		if (!p.classList.contains('cursor-not-allowed')) {
			p.addEventListener('click', async () => { 
				const formattedDate = selectedDate.toLocaleDateString(
					currentLang === 'en' ? 'en-US' : 'de-DE',
					{ day: '2-digit', month: '2-digit', year: 'numeric' }
				);

				const userMessage =
					currentLang === 'en'
						? `Can I book an appointment on ${formattedDate} at ${time}?`
						: `Kann ich einen Termin am ${formattedDate} um ${time} buchen?`;

				addMessage(userMessage, 'user');

				typingIndicator.classList.remove('hidden');
				chatBox.appendChild(typingIndicator);
				chatBox.scrollTop = chatBox.scrollHeight;

				sidebar.classList.add('-translate-x-full');
				const historyForBackend = getLastPairs(5);

				try {
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

					if (rating === null || rating === 'null') {
						addRatingCard();
						botReplyToStore = 'RATING:null';
					} else if (rating === 'booking') {
						if (output) addMessage(output, 'bot');
						addRatingCard();
						botReplyToStore = 'RATING:booking';
					} else {
						if (output) {
							if (typeof output === 'string') {
								addMessage(output, 'bot');
								botReplyToStore = output;
							} else if (typeof output === 'object') {
								addPersonInfo(output, 'bot');
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
			});
		}
		timesContainer.appendChild(p);
	});
}

/* ======= اختيار اليوم ======= */
daysGrid.addEventListener('click', (e) => {
	const dayEl = e.target;
	if (!dayEl.classList.contains('cursor-pointer')) return;

	const day = parseInt(dayEl.textContent);
	const month = parseInt(monthSelect.value);
	const year = new Date().getFullYear();
	selectedDate = new Date(year, month, day);

	generateTimes();
	timesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
