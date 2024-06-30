import { User } from "./app";
import "./style.css";

const ScreenController = () => {
  // DOM elements
  const taskList = document.querySelector("#task-list");
  const projectsDiv = document.querySelector("#projects");
  const newProjectBtn = document.querySelector("#new-project");
  const newProjectDialog = document.getElementById("newProjectDialog");
  const confirmProjectBtn = document.getElementById("confirmProjectBtn");
  const cancelProjectBtn = document.getElementById("cancelProjectBtn");
  const deleteProjectBtn = document.querySelector("#delete-project");
  const editProjectBtn = document.querySelector("#edit-project");
  const newTaskBtn = document.querySelector("#new-task");
  const newTaskDialog = document.getElementById("newTaskDialog");
  const confirmTaskBtn = document.getElementById("confirmTaskBtn");
  const cancelTaskBtn = document.getElementById("cancelTaskBtn");
  const currentProjectName = document.querySelector("#current-project-name");
  const currentProjectDescription = document.querySelector(
    "#current-project-description"
  );

  let taskBeingEdited = null;
  let projectBeingEdited = null;

  // showModal buttons
  newProjectBtn.addEventListener("click", () => {
    newProjectDialog.showModal();
  });

  newTaskBtn.addEventListener("click", () => {
    newTaskDialog.showModal();
  });

  // dialog buttons
  confirmProjectBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // if there is an existing project passed, edit using the form info
    if (projectBeingEdited) {
      projectBeingEdited.editProjectInfo(getProjectFormInfo());
      currentUser.saveToLocalStorage();
    } else {
      currentUser.addProject(getProjectFormInfo());
      // sets current project to new project
      currentUser.setCurrentProject(currentUser.projects.slice(-1)[0].id);
    }

    // refresh list of projects
    projectsDiv.textContent = "";
    displayProjects(currentUser.projects);
    displaySelectedProject(currentUser.getCurrentProject().id);

    currentUser.saveToLocalStorage();

    projectBeingEdited = null;
    clearFormFields();

    newProjectDialog.close();
  });

  cancelProjectBtn.addEventListener("click", () => {
    projectBeingEdited = null;
    clearFormFields();
  });

  confirmTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // if there is an existing task passed, edit using the form info
    if (taskBeingEdited) {
      taskBeingEdited.editTaskInfo(getTaskFormInfo());
      currentUser.saveToLocalStorage();
    } else {
      currentUser.getCurrentProject().addTask(getTaskFormInfo());
    }

    displayProjectTasks(currentUser.getCurrentProject());

    currentUser.saveToLocalStorage();

    taskBeingEdited = null;
    clearFormFields();
    newTaskDialog.close();
  });

  cancelTaskBtn.addEventListener("click", () => {
    taskBeingEdited = null;
    clearFormFields();
  });

  // project manipulation buttons
  editProjectBtn.addEventListener("click", () => {
    projectBeingEdited = currentUser.getCurrentProject();
    fillProjectFormInfo(projectBeingEdited);
    newProjectDialog.showModal();
  });

  deleteProjectBtn.addEventListener("click", () => {
    // delete project from array
    currentUser.deleteProject(currentUser.getCurrentProject().id);

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

    currentUser.saveToLocalStorage();
  });

  // form info functions
  function clearFormFields() {
    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskPriority").value = "high";
  }

  function fillProjectFormInfo(project) {
    document.getElementById("projectName").value = project.name;
    document.getElementById("projectDescription").value = project.description;
  }

  function fillTaskFormInfo(task) {
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("taskDueDate").value = task.dueDate;
    document.getElementById("taskPriority").value = task.priority;
  }

  function getProjectFormInfo() {
    const name = document.getElementById("projectName").value;
    const description = document.getElementById("projectDescription").value;

    return { name, description };
  }

  function getTaskFormInfo() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const priority = document.getElementById("taskPriority").value;

    return { title, description, dueDate, priority };
  }

  // other display functions
  function displayProjects(projectArr) {
    projectsDiv.textContent = "";
    projectArr.forEach((project) => {
      const newProjectElement = document.createElement("button");
      newProjectElement.setAttribute("id", project.id);
      newProjectElement.setAttribute("class", `project-btn`);

      newProjectElement.textContent = project.name;

      projectsDiv.appendChild(newProjectElement);

      newProjectElement.addEventListener("click", () => {
        displaySelectedProject(project.id);
      });
    });
  }

  function hideProjectDetails() {
    currentProjectName.textContent = "";
    currentProjectDescription.textContent = "";
    newTaskBtn.setAttribute("style", "visibility: hidden");
    editProjectBtn.setAttribute("style", "visibility: hidden");
    deleteProjectBtn.setAttribute("style", "visibility: hidden");
    taskList.textContent = "";
  }

  function displaySelectedProject(projectId) {
    currentUser.setCurrentProject(projectId);

    // fill display element with selected project information
    currentProjectName.textContent = currentUser.getCurrentProject().name;

    currentProjectDescription.textContent =
      currentUser.getCurrentProject().description;

    newTaskBtn.setAttribute("style", "visibility: visible");
    editProjectBtn.setAttribute("style", "visibility: visible");
    deleteProjectBtn.setAttribute("style", "visibility: visible");

    displayProjectTasks(currentUser.getCurrentProject());
  }

  function createTaskElement(task) {
    const newTaskElement = document.createElement("button");
    const expandedTask = document.createElement("p");
    const editTaskButton = createEditTaskButton(task);
    const deleteTaskBtn = createDeleteTaskButton(
      task,
      currentUser.getCurrentProject()
    );

    newTaskElement.innerHTML = task.printBasicTaskInfo();
    expandedTask.innerHTML = task.printTaskDescription();

    expandedTask.classList.add("hide-content");
    editTaskButton.classList.add("hide-content");
    deleteTaskBtn.classList.add("hide-content");

    newTaskElement.addEventListener("click", () => {
      expandedTask.classList.toggle("hide-content");
      editTaskButton.classList.toggle("hide-content");
      deleteTaskBtn.classList.toggle("hide-content");
    });

    newTaskElement.append(expandedTask, editTaskButton, deleteTaskBtn);

    return newTaskElement;
  }

  function createEditTaskButton(task) {
    const editTaskBtn = document.createElement("button");
    editTaskBtn.innerHTML = "EDIT";

    console.log(`${task.id}`);
    editTaskBtn.setAttribute("id", `${task.id}`);

    editTaskBtn.addEventListener("click", () => {
      taskBeingEdited = task;
      fillTaskFormInfo(task);
      newTaskDialog.showModal();
    });

    return editTaskBtn;
  }

  function createDeleteTaskButton(task, project) {
    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.innerHTML = "X";

    deleteTaskBtn.addEventListener("click", () => {
      project.deleteTask(task.id);
      displaySelectedProject(project.id);
      currentUser.saveToLocalStorage();
    });
    return deleteTaskBtn;
  }

  function displayProjectTasks(project) {
    taskList.textContent = "";

    project.tasks.forEach((task) => {
      const newTaskContainer = document.createElement("div");

      newTaskContainer.classList.add("task-container");

      const newTaskElement = createTaskElement(task);

      newTaskElement.classList.add(`${task.priority}`);

      newTaskContainer.appendChild(newTaskElement);
      taskList.appendChild(newTaskContainer);
    });
  }

  // set up initial default display
  let currentUser = User.loadFromLocalStorage();

  // (prevents error when page reloads after deleting all projects)
  if (currentUser.projects.length > 0) {
    displayProjects(currentUser.projects);
    displaySelectedProject(currentUser.getCurrentProject().id);
  } else {
    // don't show these if user has no projects to interact with
    newTaskBtn.setAttribute("style", "visibility: hidden");
    editProjectBtn.setAttribute("style", "visibility: hidden");
    deleteProjectBtn.setAttribute("style", "visibility: hidden");
  }

  return {
    taskList,
    newTaskBtn,
    getTaskFormInfo,
    displayProjects,
    displayProjectTasks,
  };
};

ScreenController();
