// =============================
// Focus Mode Script
// =============================

// --- State ---
let tasks = [];
let focusTimer = null;
let focusRemaining = 0;
let focusTask = "";
let focusSound = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

// =============================
// Load + Sync Tasks from localStorage
// =============================
function loadTasks() {
  try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (e) {
    tasks = [];
  }
  updateFocusTaskOptions();
}

// Keep sync if another tab updates localStorage
window.addEventListener("storage", (e) => {
  if (e.key === "tasks") loadTasks();
});

// =============================
// Populate Task Dropdown
// =============================
function updateFocusTaskOptions() {
  const select = document.getElementById("focusTaskSelect");
  select.innerHTML = '<option value="">Select a task to focus on...</option>';

  tasks.forEach((t, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = t.text.length > 60 ? t.text.slice(0, 60) + "..." : t.text;
    option.title = t.text; // shows full name on hover
    select.appendChild(option);
  });
}


// =============================
// Clock (Top Header)
// =============================
function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// =============================
// Focus Timer Logic
// =============================
function startFocus() {
  const taskSelect = document.getElementById("focusTaskSelect");
  const timeSelect = document.getElementById("focusTimeSelect");
  const status = document.getElementById("focusStatus");

  if (!taskSelect || !timeSelect || !status) return;

  const selectedTaskIndex = taskSelect.value;
  const selectedTime = parseInt(timeSelect.value);

  if (selectedTaskIndex === "" || isNaN(selectedTime)) {
    alert("⚠️ Please select a task and focus time.");
    return;
  }

  focusTask = tasks[selectedTaskIndex]?.text || "";
  focusRemaining = selectedTime * 60; // convert minutes to seconds

  if (!focusTask) {
    alert("This task no longer exists.");
    loadTasks();
    return;
  }

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
      status.innerHTML = `
        <p>⏰ Time's up!</p>
        <p>You finished focusing on: <strong>${focusTask}</strong></p>
      `;
      focusSound.play();
    }
  }, 1000);
}

// =============================
// Update Focus Status UI
// =============================
function updateFocusDisplay() {
  const status = document.getElementById("focusStatus");
  if (!status) return;

  const mins = Math.floor(focusRemaining / 60);
  const secs = focusRemaining % 60;

  status.innerHTML = `
    <div class="focus-container">
      <p>🎯 Focusing on:</p>
      <p><strong>${focusTask}</strong></p>
      <p>⏱️ Time Left: 
        <span class="focus-time">
          ${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}
        </span>
      </p>
      <button class="stop-btn" onclick="stopFocus()">Stop Focus</button>
    </div>
  `;
}


// =============================
// Stop Focus Session
// =============================
function stopFocus() {
  if (focusTimer) {
    clearInterval(focusTimer);
    focusTimer = null;
  }
  const status = document.getElementById("focusStatus");
  if (status) {
    status.className = "stopped";
    status.innerHTML = `<p>🛑 Focus session stopped.</p>`;
  }
}

// =============================
// Initialize
// =============================
loadTasks();
