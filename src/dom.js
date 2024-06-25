import {  User, Project, Task } from "./app";
import './style.css'

const ScreenController = () => {
  const currentUser = User();

  // DOM elements
  const taskList = document.querySelector("#task-list");
  const projectsDiv = document.querySelector("#projects");
  const newProjectBtn = document.querySelector("#new-project");
  const newProjectDialog = document.getElementById("newProjectDialog");
  const confirmProjectBtn = document.getElementById('confirmProjectBtn');
  const newTaskBtn = document.querySelector("#new-task");
  const newTaskDialog = document.getElementById("newTaskDialog");
  const confirmTaskBtn = document.getElementById('confirmTaskBtn');
  const currentProjectTitle = document.querySelector("#current-project-name");
  const currentProjectDescription = document.querySelector("#current-project-description");

  // showModal buttons
  newProjectBtn.addEventListener("click", () => {
    newProjectDialog.showModal();
  })

  newTaskBtn.addEventListener("click", () => {
    newTaskDialog.showModal();
  })

  // dialog buttons
  confirmProjectBtn.addEventListener("click", (event) => {
    event.preventDefault();

    getProjectFormInfo();

    // add project
    currentUser.addProject(getProjectFormInfo());

    // sets current project to new project
    currentUser.setCurrentProject(currentUser.projects.slice(-1)[0].id);

    // refresh list of projects
    projectsDiv.textContent = '';
    displayProjects(currentUser.projects);

    currentUser.displayAllProjects();
    newProjectDialog.close();
  });
  
  confirmTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // return form info
    getTaskFormInfo();
    
    currentUser.getCurrentProject().addTask(getTaskFormInfo());

    screen.displayProjectTasks(currentUser.getCurrentProject());

    newTaskDialog.close();
  });

  function getProjectFormInfo() {
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDescription').value;

    return { name, description };
  }

  function getTaskFormInfo() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    return { title, description, dueDate, priority };
  }

  function displayProjects(projectArr) {
    projectArr.forEach(project => {
      const newProjectElement = document.createElement('button');
      newProjectElement.setAttribute('id', project.id);
      newProjectElement.setAttribute('class', `project-btn`);

      newProjectElement.textContent = project.name;

      projectsDiv.appendChild(newProjectElement);

      newProjectElement.addEventListener('click', () => {
        displaySelectedProject(newProjectElement);
      })
    })
  }

  function displaySelectedProject(project) {
    currentUser.setCurrentProject(project.id);

    // fill display element with selected project information
    currentProjectTitle.textContent = currentUser.getCurrentProject().name;

    currentProjectDescription.textContent = currentUser.getCurrentProject().description;

    newTaskBtn.setAttribute("style", "visibility: visible")

    displayProjectTasks(currentUser.getCurrentProject());
  }

  function createTaskElement(task) {
    const newTaskElement = document.createElement('button');
    newTaskElement.innerHTML = task.printBasicTaskInfo();
    
    newTaskElement.addEventListener('click', () => {
      extraTaskInfo.classList.toggle("hide-extra-info");
    });
  }
  
  function createTaskDeleteButton(task, project) {
    const deleteTaskBtn = document.createElement('button');
    deleteTaskBtn.innerHTML = 'X';
    
    deleteTaskBtn.addEventListener('click', () => {
      project.deleteTask(task.id);
      displaySelectedProject(project);
    });
  }
  
  function displayProjectTasks(project) {
    taskList.textContent = '';
    
    project.tasks.forEach(task => {
      const newTaskContainer = document.createElement('div');
      const extraTaskInfo = document.createElement("p");
  
      newTaskContainer.classList.add("task-container");
      extraTaskInfo.classList.add("hide-extra-info");
  
      const newTaskElement = createTaskElement(task);
      const deleteTaskBtn = createTaskDeleteButton(task, project);
  
      extraTaskInfo.innerHTML = task.printExtraTaskInfo();
  
      newTaskElement.appendChild(extraTaskInfo);
      newTaskContainer.append(newTaskElement, deleteTaskBtn);
      taskList.appendChild(newTaskContainer);
    });
  }

  // set up initial default display
  displayProjects(currentUser.projects);
  displaySelectedProject(currentUser.getCurrentProject());
}

const screen = ScreenController();
