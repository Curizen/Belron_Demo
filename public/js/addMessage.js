function addMessage(data, from = 'user') {
	const time = new Date().toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	});

	const safeVal = (val) => (val && val.trim && val.trim() !== '' ? val : '-');

	let contentHTML = '';

	if (typeof data === 'string') {
		contentHTML = `<p>${data}</p>`;
	} else if (typeof data === 'object' && data !== null) {
		const obj = data.output || data;

		contentHTML = `<div class="space-y-1 text-sm">`;
		for (const key in obj) {
			if (!obj.hasOwnProperty(key)) continue;

			const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
			const value = obj[key];

			if (typeof value === 'object' && value !== null) {
				contentHTML += `<p><span class="font-bold text-gray-700">${displayKey}:</span></p>`;
				contentHTML += `<div class="ml-4 p-2 border-l border-gray-300">${JSON.stringify(value, null, 2)}</div>`;
			} else {
				contentHTML += `<p><span class="font-bold text-gray-700">${displayKey}:</span> ${safeVal(value)}</p>`;
			}
		}
		contentHTML += `</div>`;
	}

	let messageHTML = '';
	if (from === 'user') {
		messageHTML = `
			<div class="bg-gradient-to-tl from-red-400 to-gray-400 text-white px-3.5 py-2.5 rounded-2xl border border-gray-300 max-w-[75%] text-[14px] leading-[1.5] ml-auto font-semibold shadow-xl relative">
				${contentHTML}
				<br><span class="text-[10px] text-[#f5f2ee]">${time}</span>
			</div>`;
	} else {
		messageHTML = `
			<div class="bg-[#e9ecef] text-gray-700 px-3.5 py-2.5 rounded-2xl border border-gray-300 max-w-[75%] text-[14px] leading-[1.5] font-semibold shadow-xl relative">
				<div class="absolute -top-4 -left-4">
					<img class="w-8 h-auto" src="/images/logo-chatbot.png" alt="">
				</div>
				${contentHTML}
				<br><span class="text-[10px] text-[#777]">${time}</span>
			</div>`;
	}

	chatBox.innerHTML += messageHTML;
	chatBox.scrollTop = chatBox.scrollHeight;
}
