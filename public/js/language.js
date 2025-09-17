let currentLang = 'en';

const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const servicesContainer = document.getElementById('servicesContainer');
const langToggle = document.getElementById('langToggle');
const servicesTitle = document.getElementById('servicesTitle');
const servicesDesc = document.getElementById('servicesDesc');

const texts = {
	en: {
		title: 'Carglass Services',
		desc: 'Choose the service you want to learn more about. Our expert team is ready to guide you.',
		langBtn: 'DE',
		userPlaceholder: 'Type your message...'
	},
	de: {
		title: 'Carglass Dienstleistungen',
		desc: 'Wählen Sie den Service, über den Sie mehr erfahren möchten. Unser Expertenteam steht bereit.',
		langBtn: 'EN',
		userPlaceholder: 'Ihre Nachricht...'
	}
};

function updateLanguageUI() {
	servicesTitle.textContent = texts[currentLang].title;
	servicesDesc.textContent = texts[currentLang].desc;
	langToggle.textContent = texts[currentLang].langBtn;
	messageInput.placeholder = texts[currentLang].userPlaceholder;
}

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
