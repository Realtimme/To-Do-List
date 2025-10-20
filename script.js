function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const taskList = document.getElementById("taskList");

    // Create task item
    const li = document.createElement("li");

    // Task content
    const topRow = document.createElement("div");
    topRow.className = "top-row";

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    const btn = document.createElement("button");
    btn.textContent = "✅";
    btn.onclick = () => markAsFinished(li, taskText, dateTime);

    topRow.appendChild(taskSpan);
    topRow.appendChild(btn);

    // Date and time
    const dateTime = new Date().toLocaleString();
    const dateSpan = document.createElement("small");
    dateSpan.textContent = `Added: ${dateTime}`;

    li.appendChild(topRow);
    li.appendChild(dateSpan);

    taskList.appendChild(li);
    taskInput.value = "";
}
function handleKeyPress(event) {
  if (event.key === "Enter") {
    addTask();
  }
}


function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Start the clock and update every second
setInterval(updateClock, 1000);
updateClock(); // initial call



function markAsFinished(taskElement, taskText, addedDateTime) {
    const finishedList = document.getElementById("finishedList");

    const li = document.createElement("li");
    li.classList.add("completed");

    const topRow = document.createElement("div");
    topRow.className = "top-row";

    const span = document.createElement("span");
    span.textContent = taskText;

    const dateSpan = document.createElement("small");
    dateSpan.textContent = `Finished: ${new Date().toLocaleString()}`;

    topRow.appendChild(span);
    li.appendChild(topRow);

    const originalTime = document.createElement("small");
    originalTime.textContent = `Started: ${addedDateTime}`;
    li.appendChild(originalTime);
    li.appendChild(dateSpan);

    finishedList.appendChild(li);

    // Remove from main task list
    taskElement.remove();
}

