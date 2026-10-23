
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const remainingCount = document.getElementById("remainingCount");

addBtn.addEventListener("click", addTask);

// Ticket: Lägga till en uppgift
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Skriv en uppgift!");
        return;
    }

    const li = document.createElement("li");

    // Checkbox för att markera uppgiften som klar
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", "Markera uppgift som klar");

    checkbox.addEventListener("change", updateRemainingCount);

    // Uppgiftens titel
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = taskText;

    // Knapp för att redigera uppgiften
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Redigera";
    editBtn.addEventListener("click", function () {
        editTask(title);
    });

    // Lägg till alla delar i uppgiften
    li.append(checkbox, title, editBtn);
    taskList.appendChild(li);

    taskInput.value = "";
    taskInput.focus();

    updateRemainingCount();
}

// Ticket: Visa antalet återstående uppgifter
function updateRemainingCount() {
    const tasks = taskList.querySelectorAll("li");

    let remaining = 0;

    tasks.forEach(function (task) {
        const checkbox = task.querySelector('input[type="checkbox"]');

        if (!checkbox.checked) {
            remaining++;
        }
    });

    remainingCount.textContent = remaining;
}

// Ticket: Redigera en uppgift
function editTask(titleElement) {
    const oldTitle = titleElement.textContent;
    const newTitle = prompt("Ändra uppgiftens titel:", oldTitle);

    if (newTitle === null) {
        return;
    }

    if (newTitle.trim() === "") {
        alert("Uppgiftens titel får inte vara tom.");
        return;
    }

    titleElement.textContent = newTitle.trim();
}
