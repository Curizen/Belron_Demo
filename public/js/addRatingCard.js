function addRatingCard() {
	const wrapper = document.createElement('div');
	wrapper.innerHTML = `
          <div class="flex items-center justify-center my-2 border border-gray-100">
            <div class="bg-white flex flex-col items-center shadow-lg rounded-2xl p-6 w-full md:w-[90%] text-center rating-card">
                <div class="flex flex-col">
                  <div class="flex items-center gap-0.5">
                    <div class="triangle-yellow"></div>

                    <div class="square-yellow"></div>

                    <div class="square-red"></div>
                    <div class="square-red"></div>

                    <div class="triangle-red"></div>
                  </div>
                  <p class="font-bold text-[#f11717] text-xl flex items-start gap-1 tracking-wider">
                    BELRON
                    <span class="inline-flex items-center justify-center border border-red-600 rounded-full w-3 h-3 mt-1 text-[8px]">
                      R
                    </span>
                </p>
                </div>
              <p class="text-lg font-semibold text-gray-600 mb-4">
                Rate your experience and help us improve
              </p>

              <div class="flex justify-center gap-0.5 md:gap-2 text-3xl md:text-4xl cursor-pointer mb-3 stars-wrapper">
                ${Array.from(
					{ length: 10 },
					(_, i) =>
						`<span data-value="${i +
							1}" class="star text-gray-300 transition-transform transform hover:scale-125">★</span>`
				).join('')}
              </div>

              <div class="rating-result hidden mt-3">
                <p class="rating-message text-green-600 font-semibold"></p>
                <p class="rating-score text-gray-800 mt-1"></p>
              </div>
            </div>
          </div>
        `;
	chatBox.appendChild(wrapper);
	chatBox.scrollTop = chatBox.scrollHeight;

	initRatingCard(wrapper);
}
