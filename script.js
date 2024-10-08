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

const todaysTasks = () => {
    return userData.filter(task => task.createdDate.split('-')[0] == new Date().getDate());
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
            createdDate: `${day}-${month}-${year}`,
            isExpired: false,
        };
        userData.unshift(newTaskObj);
    }
    localStorage.setItem("user-data", JSON.stringify(userData));
    checkExpiredTasks();
    updateTaskField();
    clear();
    currentTask = {};
};

const updateHeaderTitle = () => {
    headerTitle.innerHTML = `${todaysTasks().filter(e => !e.isCompleted).length} open tasks`;
}

const updateTaskField = () => {
    taskContainer.innerHTML = '';
    todaysTasks().forEach(({id, title, dueDate, isCompleted, createdDate, isExpired}) => {
            taskContainer.innerHTML += `
            <div class="task task-${createdDate} ${isExpired ? "expired" : ""}" id="${id}">
                <div class="task-content">
                    <span class="due-time">${dueDate}</span>
                    <h2 class="task-title">${title}</h2>
                </div>
                <input type="checkbox" name="checkbox" id="checkbox" ${isCompleted ? "checked" : ""}>
            </div>`;
    });
    updateHeaderTitle();
    addCheckboxListeners();
};

const addCheckboxListeners = () => {
    document.querySelectorAll('.task input[type="checkbox"]').forEach(checkbox => {
        const taskDiv = checkbox.closest('.task');
        if (checkbox.checked) taskDiv.classList.add('completed');
        checkbox.addEventListener('change', function() {
            const taskId = taskDiv.id;
            const dataArrIndex = userData.findIndex((item) => item.id === taskId);
            userData[dataArrIndex].isCompleted = checkbox.checked;
            taskDiv.classList.toggle('completed', checkbox.checked);
            updateHeaderTitle();
            localStorage.setItem("user-data", JSON.stringify(userData));
            currentTask = userData[dataArrIndex];
            editTaskIcon.style.display = userData[dataArrIndex].isCompleted ? "block" : "none";
            const completedTaskCount = todaysTasks().filter(e => e.isCompleted).length;
            const width = (completedTaskCount/todaysTasks().length)*100;
            document.querySelector(".progressBar").style.setProperty('--progress-width',`${width}%`)
        });
    });
};

const clear = () => {
    title.value = "";
    dueDate.value = "";
    currentTask = {};
    editTaskIcon.style.display = "none";
    toggleAddTaskWindow();
}

const deleteTask = () => {
    const index = userData.findIndex((item) => item.id === currentTask.id);
    userData.splice(index, 1);
    localStorage.setItem("user-data", JSON.stringify(userData));
    if (!userData.length) document.querySelector(".progressBar").style.setProperty('--progress-width',`0%`)
    updateTaskField();
    clear();
}

const checkExpiredTasks = () => {
    const date = new Date();
    const expiredTasks = todaysTasks().filter((item) => item.dueDate < `${date.getHours()}:${date.getMinutes()}`)
    todaysTasks().forEach(e => e.isExpired = false)
    if (expiredTasks) {
        expiredTasks.forEach((e) => {
            e.isExpired = true;
        })
        updateTaskField();
    }
}

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

const toggleAddTaskWindow = () => {
    container.classList.toggle("toggle-add-task");
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

modeSwitch.addEventListener("click", () => {
    body.classList.contains("dark") ? systemTheme = "light" : systemTheme = "dark";
        localStorage.setItem("system-theme", JSON.stringify(systemTheme));
    handleThemeSwitch();
})

addTaskIcon.addEventListener("click", () => {
    clear();
    document.querySelector("#header h2").innerText = "Add a new task";
    deleteIcon.style.display="none";
})

goBackIcon.addEventListener("click", () => {
    toggleAddTaskWindow()
})

editTaskIcon.addEventListener("click", () => {
    const index = todaysTasks().findIndex((item) => item.id === currentTask.id);
    title.value = todaysTasks()[index].title;
    dueDate.value = todaysTasks()[index].dueDate;
    document.querySelector("#header h2").innerText = "Editing the task";
    deleteIcon.style.display="block";
    toggleAddTaskWindow();
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
        const completedTaskCount = todaysTasks().filter(e => e.isCompleted).length;
        const width = (completedTaskCount/todaysTasks().length)*100;
        document.querySelector(".progressBar").style.setProperty('--progress-width',`${width}%`)
        checkExpiredTasks();
        updateTaskField();
})
