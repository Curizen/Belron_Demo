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
		// إذا كان object يحتوي على output وهو object => استخدم شكل البطاقة
		if (data.output && typeof data.output === 'object') {
			const info = data.output;
			contentHTML = `
				<div class="space-y-1 text-sm">
					<p><span class="font-bold text-gray-700">👤 Name:</span> ${safeVal(info.Name)}</p>
					<p><span class="font-bold text-gray-700">📞 Phone:</span> ${safeVal(info.Phone_number)}</p>
					<p><span class="font-bold text-gray-700">✉️ Email:</span> ${safeVal(info.Email)}</p>
					<p><span class="font-bold text-gray-700">🚗 Car Name:</span> ${safeVal(info.Car_name)}</p>
					<p><span class="font-bold text-gray-700">🚘 Car Type:</span> ${safeVal(info.Car_type)}</p>
					<p><span class="font-bold text-gray-700">🔢 Car Number:</span> ${safeVal(info.Car_number)}</p>
					<p><span class="font-bold text-gray-700">📅 Date:</span> ${safeVal(info.date)}</p>
					<p><span class="font-bold text-gray-700">🧠 Memory:</span> ${safeVal(info.memory)}</p>
					<p><span class="font-bold text-gray-700">📝 Description:</span> ${safeVal(info.Description)}</p>
					<p><span class="font-bold text-gray-700">📌 Status:</span> ${safeVal(info.status)}</p>
					<p><span class="font-bold text-gray-700">💬 Content:</span> ${safeVal(info.content)}</p>
				</div>
			`;
		} else if (data.start_date && data.end_date) {
			// إذا كان object لمواعيد => استخدم شكل المواعيد
			const startDate = new Date(data.start_date);
			const endDate = new Date(data.end_date);
			const dateLabel = startDate.toLocaleDateString();
			const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			contentHTML = `
				<div class="flex items-center justify-between gap-2 mb-3">
					<div><span class="text-lg">📅</span>
						<span class="font-semibold text-gray-900">Appointment Details</span>
					</div>
					<div><span class="font-semibold text-gray-900">${dateLabel}</span></div>
				</div>
				<div class="space-y-1 text-sm">
					<p><span class="font-bold text-gray-700">⏰ Time:</span> ${startTime} - ${endTime}</p>
					<p><span class="font-bold text-gray-700">👤 Name:</span> ${data.fullName}</p>
					<p><span class="font-bold text-gray-700">📞 Phone:</span> ${data.contact.phone}</p>
					<p><span class="font-bold text-gray-700">✉️ Email:</span> ${data.contact.email}</p>
					<p><span class="font-bold text-gray-700">🚗 Vehicle:</span> ${data.vehicle.make} ${data.vehicle.model} (${data
				.vehicle.year})</p>
					<p><span class="font-bold text-gray-700">🔧 Service:</span> ${data.service}</p>
				</div>
			`;
		} else {
			contentHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
		}
	}

	// بناء الرسالة
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
