let tasks = [];
let finishedTasks = [];

// ✅ Load tasks from localStorage when page loads
window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));
  const savedFinished = JSON.parse(localStorage.getItem("finishedTasks"));

  if (savedTasks) {
    tasks = savedTasks;
    tasks.forEach((task) => renderTask(task));
  }

  if (savedFinished) {
    finishedTasks = savedFinished;
    finishedTasks.forEach((task) => renderFinishedTask(task));
  }
};

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const dateTime = new Date().toLocaleString();

  const task = {
    text: taskText,
    added: dateTime,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTask(task);

  taskInput.value = "";
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    addTask();
  }
}

function renderTask(task) {
  const taskList = document.getElementById("taskList");

  const li = document.createElement("li");

  const topRow = document.createElement("div");
  topRow.className = "top-row";

  const taskSpan = document.createElement("span");
  taskSpan.className = "task-text";
  taskSpan.textContent = task.text;

  const btn = document.createElement("button");
  btn.textContent = "✅";
  btn.onclick = () => markAsFinished(li, task);

  topRow.appendChild(taskSpan);
  topRow.appendChild(btn);

  const dateBlock = document.createElement("div");
  dateBlock.className = "date-block";
  dateBlock.innerHTML = `<small>Added:</small> <small>${task.added}</small>`;

  li.appendChild(topRow);
  li.appendChild(dateBlock);

  taskList.appendChild(li);
}

function markAsFinished(taskElement, task) {
  // Remove from current task list
  tasks = tasks.filter((t) => t.text !== task.text || t.added !== task.added);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Add to finished list
  const finishedTask = {
    text: task.text,
    added: task.added,
    finished: new Date().toLocaleString(),
  };

  finishedTasks.push(finishedTask);
  localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));

  renderFinishedTask(finishedTask);

  taskElement.remove();
}

function renderFinishedTask(task) {
  const finishedList = document.getElementById("finishedList");

  const li = document.createElement("li");
  li.classList.add("completed");

  const topRow = document.createElement("div");
  topRow.className = "top-row";

  const span = document.createElement("span");
  span.textContent = task.text;

  topRow.appendChild(span);
  li.appendChild(topRow);
  const started = document.createElement("div");
  started.innerHTML = `<small>Started:</small> <small>${task.added}</small>`;

  const finished = document.createElement("div");
  finished.innerHTML = `<small>Finished:</small> <small>${task.finished}</small>`;

  li.appendChild(started);
  li.appendChild(finished);

  finishedList.appendChild(li);
}

function renderFinishedTask(task) {
  const finishedList = document.getElementById("finishedList");

  const li = document.createElement("li");
  li.classList.add("completed");

  const topRow = document.createElement("div");
  topRow.className = "top-row";

  const span = document.createElement("span");
  span.textContent = task.text;

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Delete finished task";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.onclick = () => {
    // Remove from finishedTasks array
    finishedTasks = finishedTasks.filter(
      (t) => t.text !== task.text || t.added !== task.added
    );
    localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));
    // Remove from DOM
    li.remove();
  };

  topRow.appendChild(span);
  topRow.appendChild(deleteBtn);
  li.appendChild(topRow);

  const started = document.createElement("small");
  started.textContent = `Started: ${task.added}`;

  const finished = document.createElement("small");
  finished.textContent = `Finished: ${task.finished}`;

  li.appendChild(started);
  li.appendChild(finished);

  finishedList.appendChild(li);
}

// ⏰ Live clock at top
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

// 🎯 Focus Mode
let focusTimer = null;
let focusRemaining = 0;
let focusTask = "";
let focusSound = new Audio(
  "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
);

// Update task dropdown every time tasks change
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

// Modify addTask() to refresh dropdown
const originalAddTask = addTask;
addTask = function () {
  originalAddTask();
  updateFocusTaskOptions();
};

// Also refresh after loading saved tasks
window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));
  const savedFinished = JSON.parse(localStorage.getItem("finishedTasks"));

  if (savedTasks) {
    tasks = savedTasks;
    tasks.forEach((task) => renderTask(task));
  }

  if (savedFinished) {
    finishedTasks = savedFinished;
    finishedTasks.forEach((task) => renderFinishedTask(task));
  }

  updateFocusTaskOptions();
};

// Start Focus Timer
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
  focusRemaining = selectedTime * 60; // convert minutes to seconds

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

// Update Focus Display
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
  document.getElementById("focusStatus").innerHTML =
    "<p>Focus session stopped.</p>";
}
