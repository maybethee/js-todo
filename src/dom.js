import {  User, Task, Project } from "./app";
import './style.css'

const ScreenController = () => {
  const currentUser = User();

  // DOM elements
  const contentDiv = document.querySelector("#content");
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

  function displayProjectTasks(project) {
    contentDiv.textContent = '';
    project.tasks.forEach(task => {
      const newTaskElement = document.createElement('p');
  
      newTaskElement.textContent = task.printTaskInfo();
  
      contentDiv.appendChild(newTaskElement);
    })
  }

  // set up initial default display
  displayProjects(currentUser.projects);
  displaySelectedProject(currentUser.getCurrentProject());

  return {
    contentDiv,
    newTaskBtn,
    getProjectFormInfo,
    getTaskFormInfo,
    displayProjects,
    displayProjectTasks
  }
}

const screen = ScreenController();
