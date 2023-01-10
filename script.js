const request = window.indexedDB.open("tasks", 1);
request.onupgradeneeded = event => {
  const db = event.target.result;
  db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
};

function addTask() {
  let task = document.getElementById("task").value;
  if (!task) return alert("Please enter a task!");
  let li = document.createElement("li");
  li.innerHTML = task + "<button onclick=removeTask(this)>Remove</button><button onclick=editTask(this)>Edit</button>";
  li.onclick = function(){this.classList.toggle("completed")};
  document.getElementById("tasks").appendChild(li);
  document.getElementById("task").value = "";
  saveTasksToLocalStorage();
}

function removeTask(btn) {
  btn.parentNode.remove();
  saveTasksToLocalStorage();
}

function editTask(btn) {
  let task = btn.previousSibling;
  task.setAttribute("contenteditable", "true");
  task.focus();
  task.onblur = function(){
    task.setAttribute("contenteditable", "false");
    saveTasksToLocalStorage();
  }
}

function saveTasksToLocalStorage(){
  const request = window.indexedDB.open("tasks", 1);
  request.onsuccess = event => {
    const db = event.target.result;
    const tx = db.transaction(["tasks"], "readwrite");
    const store = tx.objectStore("tasks");

    // First remove all tasks from the database
    store.clear();

    let tasks = document.getElementById("tasks").children;
    for (let i = 0; i < tasks.length; i++) {
      store.add({ task: tasks[i].innerText });
    }
  };
}

function loadTasksFromLocalStorage(){
  const request = window.indexedDB.open("tasks", 1);
  request.onsuccess = event => {
    const db = event.target.result;
    const tx = db.transaction(["tasks"], "readonly");
    const store = tx.objectStore("tasks");
    const request = store.getAll();
    request.onsuccess = event => {
      const tasks = event.target.result;
      tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = task.task + "<button onclick=removeTask(this)>Remove</button><button onclick=editTask(this)>Edit</button>";
        li.onclick = function(){this.classList.toggle("completed")};
        document.getElementById("tasks").appendChild(li);
      });
    };
  };
}
