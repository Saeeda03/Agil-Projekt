const taskInput = document.getElementById("taskInput");
const taskDescription = document.getElementById("taskDescription");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskFilter = document.getElementById("taskFilter");
const emptyMessage = document.getElementById("emptyMessage");
// The project has no API yet, so browser storage is the current task source.
const storageKey = "agil-projekt-tasks";
let tasks = loadTasks();

taskForm.addEventListener("submit", addTask);
taskFilter.addEventListener("change", renderTasks);
renderTasks();

function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(storageKey);
        if (storedTasks === null) {
            return [];
        }

        const parsedTasks = JSON.parse(storedTasks);
        if (!Array.isArray(parsedTasks)
            || !parsedTasks.every((task) => task
                && typeof task.id === "string"
                && typeof task.title === "string")) {
            throw new Error("Uppgiftsinformationen har ett ogiltigt format.");
        }

        return parsedTasks;
    } catch (error) {
        console.error("Kunde inte läsa uppgifterna.", error);
        alert("Uppgifterna kunde inte läsas. Kontrollera webbläsarens lagring och försök igen.");
        return [];
    }
}

function saveTasks(updatedTasks) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
        tasks = updatedTasks;
        renderTasks();
        return true;
    } catch (error) {
        console.error("Kunde inte spara uppgifterna.", error);
        alert("Uppgifterna kunde inte sparas. Kontrollera webbläsarens lagring och försök igen.");
        return false;
    }
}

function addTask(event) {
    event.preventDefault();

    const title = taskInput.value.trim();
    if (title === "") {
        alert("Skriv en titel för uppgiften!");
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        title,
        description: taskDescription.value.trim(),
        createdAt: new Date().toISOString(),
        completed: false,
        status: "Ej klar"
    };

    if (saveTasks([...tasks, newTask])) {
        taskForm.reset();
    }
}

function isCompleted(task) {
    return task.completed === true
        || (typeof task.status === "string" && task.status.toLowerCase() === "klar");
}

function renderTasks() {
    const filter = taskFilter.value;
    const visibleTasks = tasks.filter((task) => {
        if (filter === "completed") {
            return isCompleted(task);
        }
        if (filter === "incomplete") {
            return !isCompleted(task);
        }
        return true;
    });

    taskList.replaceChildren();
    visibleTasks.forEach((task) => {
        const item = document.createElement("li");
        item.classList.toggle("done", isCompleted(task));

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "Ingen beskrivning.";

        const createdAt = document.createElement("p");
        const parsedDate = new Date(task.createdAt);
        createdAt.textContent = `Skapad: ${Number.isNaN(parsedDate.getTime())
            ? "Okänt datum"
            : new Intl.DateTimeFormat("sv-SE").format(parsedDate)}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${isCompleted(task) ? "Klar" : "Ej klar"}`;

        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.textContent = isCompleted(task) ? "Markera som ej klar" : "Markera som klar";
        toggleButton.addEventListener("click", () => updateTaskStatus(task.id));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Ta bort";
        deleteButton.addEventListener("click", () => {
            saveTasks(tasks.filter((storedTask) => storedTask.id !== task.id));
        });

        item.append(title, description, createdAt, status, toggleButton, deleteButton);
        taskList.appendChild(item);
    });

    emptyMessage.hidden = visibleTasks.length > 0;
    if (visibleTasks.length === 0) {
        emptyMessage.textContent = filter === "incomplete"
            ? "Inga uppgifter kvar att göra."
            : "Inga uppgifter hittades.";
    }
}

function updateTaskStatus(taskId) {
    const updatedTasks = tasks.map((task) => {
        if (task.id !== taskId) {
            return task;
        }

        const completed = !isCompleted(task);
        return { ...task, completed, status: completed ? "Klar" : "Ej klar" };
    });
    saveTasks(updatedTasks);
}
