// =============================
// To-Do List + Focus Mode Script
// =============================

// --- Data Storage ---
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let finishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || [];
let focusTask = null;

// --- DOM References ---
const taskList = document.getElementById("taskList");
const finishedList = document.getElementById("finishedList");
const taskInput = document.getElementById("taskInput");
const focusTaskSelect = document.getElementById("focusTask");
const focusStatus = document.getElementById("focusStatus");

// --- Initialization ---
renderAll();

// =============================
// Task Management
// =============================

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const task = {
    text,
    added: new Date().toLocaleString(),
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTask(task);
  updateFocusTaskSelect();
  taskInput.value = "";
}

function markAsFinished(li, task) {
  li.remove();

  const finishedTask = {
    ...task,
    finished: new Date().toLocaleString(),
  };

  finishedTasks.push(finishedTask);
  tasks = tasks.filter((t) => t.text !== task.text || t.added !== task.added);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));

  renderFinishedTask(finishedTask);
  updateFocusTaskSelect();
}

function deleteFinishedTask(li, task) {
  li.remove();
  finishedTasks = finishedTasks.filter(
    (t) => t.text !== task.text || t.added !== task.added
  );
  localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));
  updateFocusTaskSelect();
}

// =============================
// Rendering Functions
// =============================

function renderAll() {
  taskList.innerHTML = "";
  finishedList.innerHTML = "";

  tasks.forEach(renderTask);
  finishedTasks.forEach(renderFinishedTask);
  updateFocusTaskSelect();
}

function renderTask(task) {
  const li = document.createElement("li");

  const topRow = document.createElement("div");
  topRow.className = "top-row";

  const taskSpan = document.createElement("span");
  taskSpan.className = "task-text";
  taskSpan.textContent = task.text;

  const btn = document.createElement("button");
  btn.textContent = "✅";
  btn.title = "Mark as finished";
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

function renderFinishedTask(task) {
  const li = document.createElement("li");
  li.classList.add("completed");

  const topRow = document.createElement("div");
  topRow.className = "top-row";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Delete finished task";
  deleteBtn.onclick = () => deleteFinishedTask(li, task);

  topRow.appendChild(span);
  topRow.appendChild(deleteBtn);

  const started = document.createElement("div");
  started.className = "date-block";
  started.innerHTML = `<small>Started:</small> <small>${task.added}</small>`;

  const finished = document.createElement("div");
  finished.className = "date-block";
  finished.innerHTML = `<small>Finished:</small> <small>${task.finished}</small>`;

  li.appendChild(topRow);
  li.appendChild(started);
  li.appendChild(finished);

  finishedList.appendChild(li);
}

// =============================
// Focus Mode
// =============================

function updateFocusTaskSelect() {
  if (!focusTaskSelect) return;
  focusTaskSelect.innerHTML = "";

  if (tasks.length === 0) {
    const option = document.createElement("option");
    option.text = "No active tasks";
    option.disabled = true;
    option.selected = true;
    focusTaskSelect.add(option);
    return;
  }

  tasks.forEach((task) => {
    const option = document.createElement("option");
    option.text = task.text;
    option.value = task.text;
    focusTaskSelect.add(option);
  });
}

function startFocus() {
  const selectedText = focusTaskSelect.value;
  if (!selectedText || selectedText === "No active tasks") return;

  focusTask = tasks.find((t) => t.text === selectedText);
  if (!focusTask) return;

  focusStatus.textContent = `Focusing on: "${focusTask.text}"`;
  focusStatus.className = "active";
}

function finishFocus() {
  if (!focusTask) return;

  const li = document.createElement("li");
  markAsFinished(li, focusTask);

  focusStatus.textContent = "Focus session finished!";
  focusStatus.className = "finished";
  focusTask = null;
}

// =============================
// Live Clock
// =============================

function updateClock() {
  const clock = document.getElementById("clock");
  if (clock) {
    clock.textContent = new Date().toLocaleTimeString();
  }
}
setInterval(updateClock, 1000);
updateClock();
