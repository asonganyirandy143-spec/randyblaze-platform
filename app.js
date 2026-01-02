// ====================
// Lessons Data
// ====================
const lessons = [
  { title: "HTML Basics", code: `<h1>Hello World</h1>\n<p>This is your first HTML page!</p>` },
  { title: "HTML Headings", code: `<h1>Main Title</h1>\n<h2>Sub Title</h2>\n<h3>Small Title</h3>` },
  { title: "HTML Links", code: `<a href="about.html">Go to About Page</a>\n<p>Links help users navigate your website.</p>` }
];

// ====================
// Current Lesson
// ====================
let currentLesson = 0;

// Load lesson in Learn page
function loadLesson(index) {
  currentLesson = index;
  localStorage.setItem("currentLesson", currentLesson);

  const lessonBox = document.getElementById("lessonBox");
  if (!lessonBox) return;

  lessonBox.innerHTML = `
    <h2>${lessons[index].title}</h2>
    <p>Edit the code below and click Run!</p>
  `;
  const codeEditor = document.getElementById("codeEditor");
  if (codeEditor) {
    codeEditor.value = lessons[index].code;
  }

  const output = document.getElementById("output");
  if (output) output.srcdoc = "";
}

// Prev / Next navigation
function nextLesson() { if (currentLesson < lessons.length - 1) loadLesson(currentLesson + 1); }
function prevLesson() { if (currentLesson > 0) loadLesson(currentLesson - 1); }

// Run HTML code in Learn page
function runCode() {
  const codeEditor = document.getElementById("codeEditor");
  const output = document.getElementById("output");
  if (!codeEditor || !output) return;
  output.srcdoc = codeEditor.value;
}

// Copy code in Learn page
function copyCode() {
  const codeEditor = document.getElementById("codeEditor");
  if (!codeEditor) return;
  codeEditor.select();
  codeEditor.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(codeEditor.value).then(() => alert("Code copied to clipboard!"));
}

// Open in Practice page
function practiceLesson() {
  const codeEditor = document.getElementById("codeEditor");
  if (!codeEditor) return;
  localStorage.setItem("practiceCode", codeEditor.value);
  window.location.href = "practice.html";
}

// ====================
// Search Lessons
// ====================
function searchLessons() {
  const query = document.getElementById("lessonSearch").value.toLowerCase();
  const buttons = document.querySelectorAll(".lesson-menu button");
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(query)) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });
}

// ====================
// Dark Mode Toggle
// ====================
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
  darkToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
  };
}

// ====================
// AI Code Helper
// ====================
const aiResponses = {
  "link": "Use <a href='url'>Link Text</a> to create links in HTML.",
  "heading": "HTML headings range from <h1> to <h6> for different sizes.",
  "paragraph": "Use <p>Your text</p> to create a paragraph.",
  "image": "Use <img src='image.jpg' alt='description'> to add images."
};

function askAI() {
  const input = document.getElementById("aiInput").value.toLowerCase();
  const response = aiResponses[input] || "Sorry, I don't have an answer for that yet!";
  document.getElementById("aiResponse").textContent = response;
}

// ====================
// Practice Page Functions (HTML) ====================
const practiceLessons = lessons;
const practiceEditor = document.getElementById("practiceEditor");
const practiceOutput = document.getElementById("practiceOutput");

function runPractice() {
  if (!practiceEditor || !practiceOutput) return;
  practiceOutput.srcdoc = practiceEditor.value;
}

function copyPracticeCode() {
  if (!practiceEditor) return;
  practiceEditor.select();
  practiceEditor.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(practiceEditor.value).then(() => alert("HTML code copied!"));
}

function savePracticeCode() {
  if (!practiceEditor) return;
  localStorage.setItem("practiceSavedCode", practiceEditor.value);
  alert("Your HTML code has been saved!");
}

// ====================
// Pyodide / Python Editor ====================
let pyodideReady = false;
let pyodide;

async function loadPyodideAndPackages() {
  pyodide = await loadPyodide();
  pyodideReady = true;
}
loadPyodideAndPackages();

// Run Python code in Practice page
async function runPython() {
  if (!pyodideReady) {
    alert("Python is still loading, wait a few seconds!");
    return;
  }
  const code = document.getElementById("pythonCode").value;
  try {
    const output = await pyodide.runPythonAsync(code);
    document.getElementById("pythonOutput").textContent = output || "(No output)";
  } catch (err) {
    document.getElementById("pythonOutput").textContent = err;
  }
}

// ====================
// Load last lesson / practice code on page load ====================
window.onload = () => {
  // Learn page
  const savedLesson = localStorage.getItem("currentLesson");
  if (savedLesson !== null && document.getElementById("lessonBox")) {
    loadLesson(Number(savedLesson));
  }

  // Practice page
  if (practiceEditor) {
    const lessonCode = localStorage.getItem("practiceCode");
    const savedCode = localStorage.getItem("practiceSavedCode");

    if (lessonCode) {
      practiceEditor.value = lessonCode;
      localStorage.removeItem("practiceCode");
    } else if (savedCode) {
      practiceEditor.value = savedCode;
    } else {
      practiceEditor.value = practiceLessons[0].code;
    }
    runPractice();
  }
};
