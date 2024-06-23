import {  User, TodoItem, Project } from "./app";

const ScreenController = () => {
  const contentDiv = document.querySelector("#content");
  const newProjectBtn = document.querySelector("#new-project");
  const newProjectDialog = document.getElementById("newProjectDialog");
  const confirmProjectBtn = document.getElementById('confirmProjectBtn');
  const newTaskBtn = document.querySelector("#new-task");
  const newTaskDialog = document.getElementById("newTaskDialog");
  const confirmTaskBtn = document.getElementById('confirmTaskBtn');
  
  newProjectBtn.addEventListener("click", () => {
    newProjectDialog.showModal()
  })

  newTaskBtn.addEventListener("click", () => {
    newTaskDialog.showModal()
  })

  function getProjectFormInfo() {
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDescription').value;

    return { name, description };
  }

  confirmProjectBtn.addEventListener("click", (event) => {
    event.preventDefault();

    getProjectFormInfo();

    // add project
    currentUser.addProject(getProjectFormInfo());
    contentDiv.textContent = '';

    currentUser.displayAllProjects()
    newProjectDialog.close();
  });

  
  function getTaskFormInfo() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    return { title, description, dueDate, priority };
  }

  confirmTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();
  
    // return form info
    getTaskFormInfo();

    // should eventually use whatever the current project is inside currentUser instead of researchPaper
    researchPaper.addTask(getTaskFormInfo());
    contentDiv.textContent = '';
    screen.displayProjectTasks(researchPaper);

  
    newTaskDialog.close();
  });

  function displayProjectTasks(project) {
    project.tasks.forEach(task => {
      const newTaskElement = document.createElement('p');
  
      newTaskElement.innerHTML = task.printTaskInfo();
  
      contentDiv.appendChild(newTaskElement);
    })
  }

  return {
    contentDiv,
    newTaskBtn,
    getProjectFormInfo,
    getTaskFormInfo,
    displayProjectTasks
  }
}

const screen = ScreenController();
const currentUser = User();
const researchPaper = Project('English Paper', 'on Fitzgerald et al');
