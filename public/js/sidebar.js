/*============ open and close sidebar ===============*/
const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('openSidebar');
const closeBtn = document.getElementById('closeSidebar');

openBtn.addEventListener('click', () => {
	sidebar.classList.remove('-translate-x-full');
});

closeBtn.addEventListener('click', () => {
	sidebar.classList.add('-translate-x-full');
});
