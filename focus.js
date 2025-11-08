let tasks = [];
let focusTimer = null;
let focusRemaining = 0;
let focusTask = "";
let focusSound = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

// Load tasks from localStorage
function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  updateFocusTaskOptions();
}

function updateFocusTaskOptions() {
  const select = document.getElementById("focusTaskSelect");
  select.innerHTML = '<option value="">Select a task to focus on...</option>';
  tasks.forEach((t, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = t.text;
    select.appendChild(option);
  });
}

// Auto-refresh tasks if localStorage changes (reactive sync)
window.addEventListener("storage", loadTasks);

// Clock
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Focus timer logic
function startFocus() {
  const taskSelect = document.getElementById("focusTaskSelect");
  const timeSelect = document.getElementById("focusTimeSelect");
  const status = document.getElementById("focusStatus");

  const selectedTaskIndex = taskSelect.value;
  const selectedTime = parseInt(timeSelect.value);

  if (selectedTaskIndex === "") {
    alert("Please select a task to focus on!");
    return;
  }

  focusTask = tasks[selectedTaskIndex].text;
  focusRemaining = selectedTime * 60;

  if (focusTimer) clearInterval(focusTimer);
  status.className = "active";
  updateFocusDisplay();

  focusTimer = setInterval(() => {
    focusRemaining--;
    updateFocusDisplay();

    if (focusRemaining <= 0) {
      clearInterval(focusTimer);
      focusTimer = null;
      status.className = "finished";
      status.innerHTML = `<p>⏰ Time's up! You finished focusing on: <strong>${focusTask}</strong></p>`;
      focusSound.play();
    }
  }, 1000);
}

function updateFocusDisplay() {
  const status = document.getElementById("focusStatus");
  const mins = Math.floor(focusRemaining / 60);
  const secs = focusRemaining % 60;
  status.innerHTML = `<p>Focusing on: <strong>${focusTask}</strong></p>
                      <p>⏱️ Time Left: ${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}</p>
                      <button onclick="stopFocus()">Stop Focus</button>`;
}

function stopFocus() {
  if (focusTimer) clearInterval(focusTimer);
  document.getElementById("focusStatus").innerHTML = "<p>Focus session stopped.</p>";
}

// Initial load
loadTasks();
