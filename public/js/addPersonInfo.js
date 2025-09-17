/*=============== card info render  =================*/

function addPersonInfo(info, from = 'bot') {
	const time = new Date().toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	});

	const safeVal = (val) => (val && val.trim && val.trim() !== '' ? val : '-');

	let contentHTML = `
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
