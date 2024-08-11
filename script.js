const body = document.querySelector("body")
const darkModeIcon = document.getElementById("dark-mode-icon");
const lightModeIcon = document.getElementById("light-mode-icon");
const modeSwitch = document.querySelector(".mode-switch")
const addTaskIcon = document.getElementById("add-task-icon");
const editTaskIcon = document.getElementById("edit-task-icon");
const goBackIcon = document.getElementById("go-back-icon");
const deleteIcon = document.getElementById("delete-icon")
const headerTitle = document.querySelector(".title");
const headerDate = document.querySelector(".date");
const container = document.querySelector(".container");
const addOrEditTaskBody = document.querySelector(".add-or-edit-task-body");
const mainPage = document.querySelector(".main-page");
const title = document.querySelector("#title");
const dueDate = document.querySelector("#due-date");
const submitBtn = document.getElementById("submit-btn");
const taskContainer = document.querySelector(".task-container");
const userData = JSON.parse(localStorage.getItem("user-data")) || [];
let systemTheme = JSON.parse(localStorage.getItem("system-theme")) || "light";
let currentTask = {};

const clear = () => {
    title.value = "";
    dueDate.value = "";
    currentTask = {};
    toggleAddTaskWindow();
}
const addOrUpdateTask = () => {
    if (currentTask.id) {
        const index = userData.findIndex((item) => item.id === currentTask.id);
        userData[index].title = title.value;
        userData[index].dueDate = dueDate.value;
    } else {
        const date = new Date();
        const [month, day, year] = [
        date.getMonth(),
        date.getDate(),
        date.getFullYear(),
        ];
        const newTaskObj = {
            id: `${title.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
            title: title.value,
            dueDate: dueDate.value,
            isCompleted: false,
            createdDate: `${day}-${month}-${year}`
        };
        userData.unshift(newTaskObj);
        localStorage.setItem("user-data", JSON.stringify(userData));
    }
    updateTaskField();
    clear();
    currentTask = {};
};

const updateTaskField = () => {
    taskContainer.innerHTML = '';
    userData.forEach(({id, title, dueDate, isCompleted, createdDate}) => {
        const currentDay = new Date().getDate();
        if (createdDate.split("-")[0] == currentDay) {
            taskContainer.innerHTML += `
            <div class="task task-${createdDate}" id="${id}">
                <div class="task-content">
                    <span class="due-time">${dueDate}</span>
                    <h2 class="task-title">${title}</h2>
                </div>
                <input type="checkbox" name="checkbox" id="checkbox" ${isCompleted ? "checked" : ""}>
            </div>`;
        }
    });
    addCheckboxListeners();
};

const addCheckboxListeners = () => {
    document.querySelectorAll('.task input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) checkbox.closest('.task').style.backgroundColor = 'var(--bg-300)'
        checkbox.addEventListener('change', function() {
            const taskId = this.parentElement.id;
            const dataArrIndex = userData.findIndex((item) => item.id === taskId);
            if (this.checked) {
                userData[dataArrIndex].isCompleted = true;
                this.closest('.task').style.backgroundColor = 'var(--bg-300)';
            } else {
                this.closest('.task').style.backgroundColor = 'transparent';
                userData[dataArrIndex].isCompleted = false;
            }
            const openTaskCount = userData.filter(e => !e.isCompleted).length;
            headerTitle.innerHTML = `${openTaskCount} open tasks`;
            localStorage.setItem("user-data", JSON.stringify(userData));
            editTaskIcon.style.display = userData[dataArrIndex].isCompleted ? "block" : "none";
            const completedTaskCount = userData.filter(e => e.isCompleted).length;
            const width = (completedTaskCount/userData.length)*100;
            document.querySelector(".progressBar").style.setProperty('--progress-width',`${width}%`)
            currentTask = userData[dataArrIndex];
        });
    });
};

const deleteTask = () => {
    const index = userData.findIndex((item) => item.id === currentTask.id);
    userData.splice(index, 1);
    localStorage.setItem("user-data", JSON.stringify(userData));
    if (!userData.length) document.querySelector(".progressBar").style.setProperty('--progress-width',`0%`)
    updateTaskField();
    clear();
}

deleteIcon.addEventListener("click", deleteTask);

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if(!title.value) {
        alert("Please fill out the title field!") 
        return;
    } else if(!dueDate.value) {
            alert("Please specify the time!")
            return;
        }
    addOrUpdateTask();
    addCheckboxListeners();
})

const handleThemeSwitch = () => {
    if (systemTheme=="light") {
        darkModeIcon.classList.remove("hidden");
        lightModeIcon.classList.add("hidden");
        body.classList.remove("dark");
    } else {
        body.classList.add("dark");
        darkModeIcon.classList.add("hidden");
        lightModeIcon.classList.remove("hidden");
    }
}

modeSwitch.addEventListener("click", () => {
    body.classList.contains("dark") ? systemTheme = "light" : systemTheme = "dark";
        localStorage.setItem("system-theme", JSON.stringify(systemTheme));
    handleThemeSwitch();
})
const toggleAddTaskWindow = () => {
    container.classList.toggle("toggle-add-task");
}
addTaskIcon.addEventListener("click", () => {
    clear();
    document.querySelector("#header h2").innerText = "Add a new task";
    deleteIcon.style.display="none";
})
goBackIcon.addEventListener("click", () => {
    toggleAddTaskWindow()
})


editTaskIcon.addEventListener("click", () => {
    const index = userData.findIndex((item) => item.id === currentTask.id);
    toggleAddTaskWindow();
    title.value = userData[index].title;
    dueDate.value = userData[index].dueDate;
    document.querySelector("#header h2").innerText = "Editing the task";
    deleteIcon.style.display="block";
});

document.addEventListener("DOMContentLoaded", () => {
    let date = new Date()
    let currentDay = date.getDate();
    let currentMonth = date.getMonth();
    switch (currentMonth) {
        case 0:
            currentMonth = "January";
            break;
        case 1:
            currentMonth = "February";
            break;
        case 2:
            currentMonth = "March";
            break;
        case 3:
            currentMonth = "April";
            break;
        case 4:
            currentMonth = "May";
            break;
        case 5:
            currentMonth = "June";
            break;
        case 6:
            currentMonth = "July";
            break;
        case 7:
            currentMonth = "August";
            break;
        case 8:
            currentMonth = "September";
            break;
        case 9:
            currentMonth = "October";
            break;
        case 10:
            currentMonth = "Novebmer";
            break;
        case 11:
            currentMonth = "Decemeber";
            break;
    }
    headerDate.innerHTML = `${currentDay} ${currentMonth}`
    const taskCount = userData.length;
            let completedTaskCount = 0;
            userData.forEach((item) => {
                if (item.isCompleted) completedTaskCount += 1;
            })
            const width = (completedTaskCount/taskCount)*100;
            document.querySelector(".progressBar").style.setProperty('--progress-width',`${width}%`)
            const openTaskCount = userData.filter(e => !e.isCompleted).length;
            headerTitle.innerHTML = `${openTaskCount} open tasks`;
    updateTaskField();
    handleThemeSwitch();
})