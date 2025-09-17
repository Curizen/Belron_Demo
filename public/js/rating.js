// rating.js
import { addConversationPair } from './chat.js';

export function addRatingCard() {
  const chatBox = document.getElementById("chatBox");
  const wrapper = document.createElement("div");
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
            <span class="inline-flex items-center justify-center border border-red-600 rounded-full w-3 h-3 mt-1 text-[8px]">R</span>
          </p>
        </div>
        <p class="text-lg font-semibold text-gray-600 mb-4">Rate your experience and help us improve</p>
        <div class="flex justify-center gap-0.5 md:gap-2 text-4xl cursor-pointer mb-3 stars-wrapper">
          ${Array.from({ length: 10 }, (_, i) => `<span data-value="${i+1}" class="star text-gray-300 transition-transform transform hover:scale-125">★</span>`).join('')}
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

function initRatingCard(wrapper) {
  const stars = wrapper.querySelectorAll(".star");
  const resultBox = wrapper.querySelector(".rating-result");
  const message = wrapper.querySelector(".rating-message");
  const score = wrapper.querySelector(".rating-score");

  let selectedValue = 0;
  let sessionIP = "unknown";

  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => sessionIP = data.ip)
    .catch(err => console.error("Failed to get IP:", err));

  const storedRating = localStorage.getItem("chat_rating");
  if (storedRating) {
    selectedValue = parseInt(storedRating);
    paintStars(selectedValue);
    resultBox.classList.remove("hidden");
    message.textContent = "✅ Your rating has been submitted successfully";
    score.textContent = `⭐ Your rating: ${selectedValue} / 10`;
  }

  function paintStars(value) {
    stars.forEach((s, index) => {
      if (index < value) {
        s.classList.remove("text-gray-300", "text-red-500");
        s.classList.add("text-yellow-400");
      } else {
        s.classList.remove("text-gray-300", "text-yellow-400");
        s.classList.add("text-red-500");
      }
    });
  }

  stars.forEach(star => {
    star.addEventListener("mouseenter", () => paintStars(parseInt(star.dataset.value)));
    star.addEventListener("mouseleave", () => paintStars(selectedValue));
    star.addEventListener("click", () => {
      selectedValue = parseInt(star.dataset.value);
      paintStars(selectedValue);
      resultBox.classList.remove("hidden");
      message.textContent = "✅ Your rating has been submitted successfully";
      score.textContent = `⭐ Your rating: ${selectedValue} / 10`;
      localStorage.setItem("chat_rating", selectedValue);
      addConversationPair("RATING", selectedValue);
      sendRating(selectedValue, sessionIP); // تحتاج تعريف sendRating في مكان مناسب
    });
  });
}
