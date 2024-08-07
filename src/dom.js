import { User } from "./app";
import "./style.css";

const ScreenController = () => {
  // main page elements
  const taskList = document.querySelector("#task-list");
  const projectsDiv = document.querySelector("#projects");

  // dialog related elements
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

  // current project elements
  const currentProjectName = document.querySelector("#current-project-name");
  const currentProjectDescription = document.querySelector(
    "#current-project-description"
  );

  // dropdown elements
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  const dropdownBtn = document.querySelector(".dropdown-btn");
  const dropdownContents = document.querySelector(".dropdown-contents");

  // error related elements
  const taskTitleInput = document.getElementById("taskTitle");
  const taskTitleError = document.querySelector("#taskTitle + span.error");
  const projectNameInput = document.getElementById("projectName");
  const projectNameError = document.querySelector("#projectName + span.error");

  let taskBeingEdited = null;
  let projectBeingEdited = null;
  let isFirstLoad = true;

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

    // validate name field
    if (!projectNameInput.value.trim()) {
      projectNameError.classList.add("active");
      projectNameError.textContent = "You need to enter a name.";
      return;
    } else {
      projectNameError.textContent = "";
      projectNameError.classList.remove("active");
    }

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
    displaySelectedProject(
      currentUser.getCurrentProject().id,
      projectsDiv.childNodes[currentUser.getCurrentProjectId()]
    );

    currentUser.saveToLocalStorage();

    projectBeingEdited = null;
    clearFormFields();

    newProjectDialog.close();
  });

  cancelProjectBtn.addEventListener("click", () => {
    projectBeingEdited = null;
    projectNameError.textContent = "";
    projectNameError.classList.remove("active");
    clearFormFields();
  });

  confirmTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // validate title field
    if (!taskTitleInput.value.trim()) {
      taskTitleError.classList.add("active");
      taskTitleError.textContent = "You need to enter a title.";
      return;
    } else {
      taskTitleError.textContent = "";
      taskTitleError.classList.remove("active");
    }

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
    taskTitleError.textContent = "";
    taskTitleError.classList.remove("active");
    clearFormFields();
  });

  // project manipulation buttons
  editProjectBtn.addEventListener("click", () => {
    projectBeingEdited = currentUser.getCurrentProject();
    fillProjectFormInfo(projectBeingEdited);
    newProjectDialog.showModal();
  });

  deleteProjectBtn.addEventListener("click", () => {
    if (confirm("Do you really want to delete this project?")) {
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
        displaySelectedProject(
          currentUser.getCurrentProject().id,
          projectsDiv.childNodes[currentUser.getCurrentProjectId()]
        );
      } else {
        hideProjectDetails();
      }

      currentUser.saveToLocalStorage();
    }
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
    projectArr.forEach((project, index) => {
      const newProjectElement = document.createElement("button");
      newProjectElement.setAttribute("id", project.id);
      newProjectElement.setAttribute("class", `project-btn`);

      if (isFirstLoad) {
        newProjectElement.setAttribute("class", "project-btn animated");
        newProjectElement.style.animationDelay = `${index * 0.06}s`;
        newProjectElement.style.transform = "translateX(-70px)";
      } else {
        newProjectElement.setAttribute("class", "project-btn");
        newProjectElement.style.transform = "none";
      }

      //remove any previously added current class
      newProjectElement.classList.remove("current");

      newProjectElement.textContent = project.name;

      projectsDiv.appendChild(newProjectElement);

      newProjectElement.addEventListener("click", () => {
        displaySelectedProject(project.id, newProjectElement);
      });
    });
  }

  function hideProjectDetails() {
    currentProjectName.textContent = "";
    currentProjectDescription.textContent = "";
    newTaskBtn.setAttribute("style", "visibility: hidden");
    dropdownBtn.setAttribute("style", "visibility: hidden");
    taskList.textContent = "";
  }

  function displaySelectedProject(projectId, projectEl = null) {
    currentUser.setCurrentProject(projectId);

    // specific project button clicked
    if (projectEl) {
      projectsDiv.childNodes.forEach((project) => {
        project.classList.remove("current");
      });
      projectEl.classList.toggle("current");
    }

    // fill display element with selected project information
    currentProjectName.textContent = currentUser.getCurrentProject().name;

    currentProjectDescription.textContent =
      currentUser.getCurrentProject().description;

    newTaskBtn.setAttribute("style", "visibility: visible");
    dropdownBtn.setAttribute("style", "visibility: visible");
    displayProjectTasks(currentUser.getCurrentProject());
  }

  function createTaskElement(task) {
    const newTaskElement = document.createElement("div");
    const newTaskInfo = document.createElement("p");
    const expandedTask = document.createElement("p");
    const editTaskButton = createEditTaskButton(task);
    const deleteTaskBtn = createDeleteTaskButton(
      task,
      currentUser.getCurrentProject()
    );

    newTaskElement.classList.add("task");

    newTaskInfo.innerHTML = task.printBasicTaskInfo();
    expandedTask.innerHTML = task.printTaskDescription();

    expandedTask.classList.add("hide-content");
    editTaskButton.classList.add("edit-task-btn");
    editTaskButton.classList.add("hide-content");
    deleteTaskBtn.classList.add("delete-task-btn");
    deleteTaskBtn.classList.add("hide-content");
    deleteTaskBtn.classList.add("delete-task-btn");

    newTaskElement.addEventListener("click", () => {
      expandedTask.classList.toggle("hide-content");
      editTaskButton.classList.toggle("hide-content");
      deleteTaskBtn.classList.toggle("hide-content");
    });

    newTaskElement.prepend(editTaskButton, deleteTaskBtn);
    newTaskElement.append(newTaskInfo, expandedTask);

    return newTaskElement;
  }

  function createEditTaskButton(task) {
    const editTaskBtn = document.createElement("button");
    editTaskBtn.innerHTML = "EDIT";

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

      if (isFirstLoad) {
        newTaskElement.setAttribute(
          "class",
          `task ${task.priority} animatedTask`
        );
        newTaskElement.style.transform = "translateY(50px)";
      } else {
        newTaskElement.classList.add(`${task.priority}`);
        newTaskElement.style.transform = "none";
      }

      newTaskContainer.appendChild(newTaskElement);
      taskList.appendChild(newTaskContainer);
    });
    // set flag to false after first load (not on project-btn anim. because this gets loaded after)
    isFirstLoad = false;
  }

  dropdownBtn.addEventListener("click", (event) => {
    dropdownContents.classList.toggle("hide-content");
    dropdownItems.forEach((item) => {
      item.classList.toggle("hide-content");
    });
    event.stopPropagation();
  });

  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      dropdownContents.classList.add("hide-content");
      dropdownItems.forEach((item) => {
        item.classList.add("hide-content");
      });
      event.stopPropagation();
    });
  });

  // hides dropdown menu buttons after another click
  document.addEventListener("click", () => {
    if (!dropdownContents.classList.contains("hide-content")) {
      dropdownContents.classList.add("hide-content");
      dropdownItems.forEach((item) => {
        item.classList.add("hide-content");
      });
    }
  });

  // set up initial default display
  let currentUser = User.loadFromLocalStorage();

  // (prevents error when page reloads after deleting all projects)
  if (currentUser.projects.length > 0) {
    console.log("user has projects");
    displayProjects(currentUser.projects);
    displaySelectedProject(currentUser.getCurrentProject().id);

    projectsDiv.childNodes[currentUser.getCurrentProjectId()].classList.toggle(
      "current"
    );
  } else {
    // don't show these if user has no projects to interact with
    newTaskBtn.setAttribute("style", "visibility: hidden");
    dropdownBtn.setAttribute("style", "visibility: hidden");
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
