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
  const currentProjectName = document.querySelector("#current-project-name");
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
    displaySelectedProject(currentUser.getCurrentProject().id)

    // currentUser.displayAllProjects();
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
    projectsDiv.textContent = '';
    projectArr.forEach(project => {
      const newProjectElement = document.createElement('button');
      newProjectElement.setAttribute('id', project.id);
      newProjectElement.setAttribute('class', `project-btn`);

      const deleteProjectBtn = createDeleteProjectButton(project);

      newProjectElement.textContent = project.name;

      projectsDiv.append(newProjectElement, deleteProjectBtn);

      newProjectElement.addEventListener('click', () => {
        displaySelectedProject(project.id);
      })
    })
  }

  // should probably further refactor this
  function createDeleteProjectButton(project) {
    const deleteProjectBtn = document.createElement('button');
    deleteProjectBtn.innerHTML = 'X';
  
    deleteProjectBtn.addEventListener('click', () => {
      if (project.id === currentUser.getCurrentProject().id) {
        // if there are other projects left, change current project to first project
        if (currentUser.projects.length > 1) {
          currentUser.setCurrentProject(currentUser.projects[0].id === project.id ? currentUser.projects[1].id : currentUser.projects[0].id);
        } else {
          // if no more projects, set current to null
          currentUser.setCurrentProject(null);
        }
      }
      currentUser.deleteProject(project.id);
  
      // update projects list
      displayProjects(currentUser.projects);
  
      // show remaining current project if one exists
      if (currentUser.getCurrentProject()) {
        displaySelectedProject(currentUser.getCurrentProject().id);
      } else {
        hideProjectDetails();
      }
    });
  
    return deleteProjectBtn;
  }

  function hideProjectDetails() {
    currentProjectName.textContent = '';
    currentProjectDescription.textContent = '';
    newTaskBtn.setAttribute("style", "visibility: hidden")
  }

  function displaySelectedProject(projectId) {
    
    currentUser.setCurrentProject(projectId);

    // fill display element with selected project information
    currentProjectName.textContent = currentUser.getCurrentProject().name;

    currentProjectDescription.textContent = currentUser.getCurrentProject().description;

    newTaskBtn.setAttribute("style", "visibility: visible")

    displayProjectTasks(currentUser.getCurrentProject());
  }

  function createTaskElement(task) {
    const newTaskElement = document.createElement('button');
    const extraTaskInfo = document.createElement("p");

    newTaskElement.innerHTML = task.printBasicTaskInfo();
    extraTaskInfo.innerHTML = task.printExtraTaskInfo();

    extraTaskInfo.classList.add("hide-extra-info");

    newTaskElement.addEventListener('click', () => {
      extraTaskInfo.classList.toggle("hide-extra-info");
    });

    newTaskElement.appendChild(extraTaskInfo);

    return newTaskElement;
  }
  
  function createDeleteTaskButton(task, project) {
    const deleteTaskBtn = document.createElement('button');
    deleteTaskBtn.innerHTML = 'X';

    deleteTaskBtn.addEventListener('click', () => {
      project.deleteTask(task.id);
      displaySelectedProject(project.id);
    });
    return deleteTaskBtn;
  }

  function displayProjectTasks(project) {
    taskList.textContent = '';
    
    project.tasks.forEach(task => {
      const newTaskContainer = document.createElement('div');

      newTaskContainer.classList.add("task-container");

      const newTaskElement = createTaskElement(task);
      const deleteTaskBtn = createDeleteTaskButton(task, project);
  
      newTaskContainer.append(newTaskElement, deleteTaskBtn);
      taskList.appendChild(newTaskContainer);
    });
  }  

  // set up initial default display
  displayProjects(currentUser.projects);
  displaySelectedProject(currentUser.getCurrentProject().id);

  return {
    taskList,
    newTaskBtn,
    getProjectFormInfo,
    getTaskFormInfo,
    displayProjects,
    displayProjectTasks
  }
}

const screen = ScreenController();
