// Jam Real-Time Functionality
const realTimeClock = document.getElementById("real-time-clock");

function updateRealTimeClock() {
  const now = new Date();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  realTimeClock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update clock every second
setInterval(updateRealTimeClock, 1000);
// Initialize clock immediately
updateRealTimeClock();

// Timer Functionality
const studyTimeInput = document.getElementById("study-time");
const breakTimeInput = document.getElementById("break-time");
const startStudyButton = document.getElementById("start-study");
const startBreakButton = document.getElementById("start-break");
const resetButton = document.getElementById("reset-button");
const timerLabel = document.getElementById("timer-label");
const timeDisplay = document.getElementById("time");

let timer;
let isStudy = true;
let remainingTime;

// Load timer settings from localStorage
function loadTimerSettings() {
  const study = localStorage.getItem("studyTime");
  const breakT = localStorage.getItem("breakTime");
  if (study) studyTimeInput.value = study;
  if (breakT) breakTimeInput.value = breakT;
}

// Inisialisasi remainingTime saat halaman dimuat
function initializeTimer() {
  isStudy = true;
  timerLabel.textContent = "Belajar";
  remainingTime = parseInt(studyTimeInput.value) * 60;
  updateDisplay();
}

// Panggil fungsi load dan initialize saat halaman dimuat
loadTimerSettings();
initializeTimer();

// Event Listeners for Start and Reset Buttons
startStudyButton.addEventListener("click", () => startTimer(true));
startBreakButton.addEventListener("click", () => startTimer(false));
resetButton.addEventListener("click", resetTimer);

function startTimer(startAsStudy) {
  // Save settings to localStorage
  localStorage.setItem("studyTime", studyTimeInput.value);
  localStorage.setItem("breakTime", breakTimeInput.value);

  if (timer) return; // Prevent multiple timers

  isStudy = startAsStudy;
  timerLabel.textContent = isStudy ? "Belajar" : "Istirahat";
  remainingTime = isStudy
    ? parseInt(studyTimeInput.value) * 60
    : parseInt(breakTimeInput.value) * 60;
  updateDisplay();

  timer = setInterval(countdown, 1000);
}

function countdown() {
  if (remainingTime <= 0) {
    clearInterval(timer);
    timer = null;
    // Switch mode
    isStudy = !isStudy;
    timerLabel.textContent = isStudy ? "Belajar" : "Istirahat";
    remainingTime = isStudy
      ? parseInt(studyTimeInput.value) * 60
      : parseInt(breakTimeInput.value) * 60;
    updateDisplay();
    // Restart timer automatically
    timer = setInterval(countdown, 1000);
  } else {
    remainingTime--;
    updateDisplay();
  }
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  isStudy = true;
  timerLabel.textContent = "Belajar";
  remainingTime = parseInt(studyTimeInput.value) * 60;
  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timeDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
  return num < 10 ? "0" + num : num;
}

// To-Do List Functionality
const newTaskInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-task");
const tasksList = document.getElementById("tasks");

addTaskButton.addEventListener("click", addTask);
newTaskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  newTaskInput.value = "";
}

function renderTasks() {
  tasksList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `flex justify-between items-center p-3 bg-gray-100 rounded-md ${
      task.completed ? "line-through text-gray-500" : ""
    }`;

    const span = document.createElement("span");
    span.textContent = task.text;

    const buttonsDiv = document.createElement("div");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Selesai";
    completeBtn.className = `px-3 py-1 mr-2 text-sm rounded-md ${
      task.completed
        ? "bg-yellow-500 hover:bg-yellow-600"
        : "bg-green-500 hover:bg-green-600"
    } text-white transition`;
    completeBtn.addEventListener("click", () => toggleComplete(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Hapus";
    deleteBtn.className =
      "px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded-md text-white transition";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    buttonsDiv.appendChild(completeBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonsDiv);
    tasksList.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
