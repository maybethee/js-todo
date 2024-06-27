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
  const cancelProjectBtn = document.getElementById('cancelProjectBtn');
  const newTaskBtn = document.querySelector("#new-task");
  const newTaskDialog = document.getElementById("newTaskDialog");
  const confirmTaskBtn = document.getElementById('confirmTaskBtn');
  const cancelTaskBtn = document.getElementById('cancelTaskBtn')
  const currentProjectName = document.querySelector("#current-project-name");
  const currentProjectDescription = document.querySelector("#current-project-description");
  const deleteProjectBtn = document.querySelector('#delete-project')

  let taskBeingEdited = null;

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

    clearFormFields();

    // currentUser.displayAllProjects();
    newProjectDialog.close();
  });

  cancelProjectBtn.addEventListener('click', () => {
    clearFormFields();
  })

  confirmTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // return form info
    getTaskFormInfo();

    // if there is an existing task passed, edit using the form info
    if (taskBeingEdited) {
      taskBeingEdited.editTaskInfo(getTaskFormInfo());
    } else {
      currentUser.getCurrentProject().addTask(getTaskFormInfo());
    }

    screen.displayProjectTasks(currentUser.getCurrentProject());

    taskBeingEdited = null;
    clearFormFields();
    newTaskDialog.close();
  });

  cancelTaskBtn.addEventListener('click', () => {
    clearFormFields();
  })

  function clearFormFields() {
    document.getElementById('projectName').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskPriority').value = 'urgent';
  }

  function fillTaskFormInfo(task) {
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskPriority').value = task.priority;
  }

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

      newProjectElement.textContent = project.name;

      projectsDiv.appendChild(newProjectElement);

      newProjectElement.addEventListener('click', () => {
        displaySelectedProject(project.id);
      })
    })
  }

  deleteProjectBtn.addEventListener('click', () => {

    // delete project from array
    currentUser.deleteProject(currentUser.getCurrentProject().id)

    // change current project to first project
    if (currentUser.projects.length >= 1) {
      currentUser.setCurrentProject(currentUser.projects[0].id);
    } else {
      // if no more projects, set current to null
      currentUser.setCurrentProject(null);
    }

    // update projects list
    displayProjects(currentUser.projects);

    // show remaining current project if one exists
    if (currentUser.getCurrentProject()) {
      displaySelectedProject(currentUser.getCurrentProject().id);
    } else {
      hideProjectDetails();
    }
  });

  function hideProjectDetails() {
    currentProjectName.textContent = '';
    currentProjectDescription.textContent = '';
    newTaskBtn.setAttribute("style", "visibility: hidden")
    deleteProjectBtn.setAttribute("style", "visibility: hidden")
    taskList.textContent = '';
  }

  function displaySelectedProject(projectId) {
    currentUser.setCurrentProject(projectId);

    // fill display element with selected project information
    currentProjectName.textContent = currentUser.getCurrentProject().name;

    currentProjectDescription.textContent = currentUser.getCurrentProject().description;

    newTaskBtn.setAttribute("style", "visibility: visible")
    deleteProjectBtn.setAttribute("style", "visibility: visible")

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

  function createEditTaskButton(task) {
    const editTaskBtn = document.createElement('button');
    editTaskBtn.innerHTML = 'EDIT';

    console.log(`${task.id}`)
    editTaskBtn.setAttribute('id', `${task.id}`)

    editTaskBtn.addEventListener('click', () => {
      taskBeingEdited = task
      fillTaskFormInfo(task)
      newTaskDialog.showModal();
    })

    return editTaskBtn;
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
      const editTaskButton = createEditTaskButton(task);
      const deleteTaskBtn = createDeleteTaskButton(task, project);

      newTaskContainer.append(newTaskElement, editTaskButton, deleteTaskBtn);
      taskList.appendChild(newTaskContainer);
    });
  }  

  // set up initial default display
  displayProjects(currentUser.projects);
  displaySelectedProject(currentUser.getCurrentProject().id);

  return {
    taskList,
    newTaskBtn,
    getTaskFormInfo,
    displayProjects,
    displayProjectTasks
  }
}

const screen = ScreenController();
