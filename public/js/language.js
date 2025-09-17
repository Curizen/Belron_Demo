function updateLanguageUI() {
	servicesTitle.textContent = texts[currentLang].title;
	servicesDesc.textContent = texts[currentLang].desc;
	langToggle.textContent = texts[currentLang].langBtn;
	messageInput.placeholder = texts[currentLang].userPlaceholder;

	servicesContainer.querySelectorAll('.service-btn').forEach((btn) => {
		btn.childNodes[0].textContent = currentLang === 'en' ? btn.dataset.serviceEn : btn.dataset.serviceDe;
	});
}

langToggle.addEventListener('click', () => {
	currentLang = currentLang === 'en' ? 'de' : 'en';
	updateLanguageUI();
});
