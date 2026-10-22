const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Skriv en uppgift!");
        return;
    }

    const li = document.createElement("li");

     li.textContent = taskText;

     li.addEventListener("click", function () {
        li.classList.toggle("done");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Ta bort";
    deleteBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        li.remove();
    });
    li.appendChild(deleteBtn);

    taskList.appendChild(li);

    taskInput.value = "";
}