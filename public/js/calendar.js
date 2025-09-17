// calendar.js
const monthSelect = document.getElementById("month-select");
const daysGrid = document.getElementById("days-grid");
const timesContainer = document.createElement("div");
timesContainer.className = "flex flex-col gap-4 mt-3";
daysGrid.after(timesContainer);

export let selectedDate = null;

const months = [ "January","February","March","April","May","June","July","August","September","October","November","December" ];
const currentMonth = new Date().getMonth();

months.forEach((month, index) => {
  const opt = document.createElement("option");
  opt.value = index;
  opt.textContent = month;
  if (index === currentMonth) opt.selected = true;
  monthSelect.appendChild(opt);
});

export function generateDays(monthIndex) {
  daysGrid.innerHTML = "";
  timesContainer.innerHTML = "";
  const today = new Date();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.textContent = i;
    day.className = "flex items-center justify-center text-center rounded-lg w-9 h-9 my-auto text-[14px] font-medium transition border border-[#ddd]";

    const currentDate = new Date(year, monthIndex, i);
    if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      day.classList.add("bg-red-200","text-gray-500","cursor-not-allowed","opacity-50");
      day.title = "Past Date";
    } else {
      const rand = Math.random();
      if (rand < 0.2) { day.classList.add("bg-red-600","text-white","cursor-not-allowed"); day.title="Not Available"; }
      else if (rand < 0.5) { day.classList.add("bg-gray-300","text-[#333]","cursor-pointer","hover:bg-gray-400"); day.title="Few Slots Available"; }
      else { day.classList.add("bg-white","text-[#333]","cursor-pointer","hover:bg-gray-100"); day.title="Available"; }
    }
    daysGrid.appendChild(day);
  }
}

generateDays(currentMonth);

monthSelect.addEventListener("change", e => generateDays(parseInt(e.target.value)));
