import { format, parseISO } from "date-fns";

const User = () => {
  let newProjectId = 1;
  const projects = [];

  let currentProjectId = null;

  function setCurrentProject(id) {
    currentProjectId = id;
  }

  function getCurrentProject() {
    return projects.find((project) => project.id === currentProjectId);
  }

  function addProject(formData) {
    const newProject = Project(
      formData.name,
      formData.description,
      newProjectId++
    );
    console.log(
      `new project name: ${newProject.name},\nNew project description: ${newProject.description}`
    );

    projects.push(newProject);
  }

  function displayAllProjects() {
    projects.forEach((project) =>
      console.log(
        `Project: ${project.name}\nDescription: ${project.description}`
      )
    );
  }

  function displayAll() {
    projects.forEach((project) => {
      console.log("displaying project info");
      project.displayProjectInfo();
      console.log("displaying tasks");
      project.logProjectTasks();
    });
  }

  function deleteProject(projectId) {
    const index = projects.findIndex((project) => project.id === projectId);
    if (index !== -1) {
      projects.splice(index, 1);
    }
  }

  (function addDefaultProject() {
    const defaultProject = Project(
      "Personal",
      "Your first project",
      newProjectId++
    );
    projects.push(defaultProject);
    setCurrentProject(1);
  })();

  return {
    projects,
    currentProjectId,
    setCurrentProject,
    getCurrentProject,
    addProject,
    displayAllProjects,
    displayAll,
    deleteProject,
  };
};

const Project = (name, description, id) => {
  let newTaskId = 1;
  const tasks = [];

  function addTask(formData) {
    // this should maybe be done more dynamically
    const newTask = Task(
      formData.title,
      formData.description,
      formData.dueDate,
      formData.priority,
      newTaskId++
    );

    this.tasks.push(newTask);
  }

  function displayProjectInfo() {
    console.log(`Project: ${this.name}\nDescription: ${this.description}`);
    return `Project: ${this.name}\nDescription: ${this.description}`;
  }

  function editProjectInfo(newValues) {
    for (let key in newValues) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = newValues[key];
      }
    }
  }

  function logProjectTasks() {
    // list tasks in its project's array
    this.tasks.forEach((task) => task.printTaskInfo());
  }

  function deleteTask(taskId) {
    const index = this.tasks.findIndex((task) => task.id === taskId);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  return {
    id,
    name,
    description,
    tasks,
    addTask,
    displayProjectInfo,
    editProjectInfo,
    deleteTask,
    logProjectTasks,
  };
};

const Task = (title, description, dueDate, priority, id) => {
  function printBasicTaskInfo() {
    const dateRegexPattern = /^\d{4}-\d{2}-\d{2}$/;

    try {
      if (this.dueDate && dateRegexPattern.test(this.dueDate)) {
        // if date isn't blank and matches regex pattern, print title of task and submitted date
        return `${this.title}<br>${format(
          parseISO(this.dueDate),
          "EEE, MMM d, yyyy"
        )}`;
      } else {
        // only print title if date is incomplete/blank
        return `${this.title}`;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  function printTaskDescription() {
    console.log(`${this.description}<br>priority: ${this.priority}`);

    return `${this.description}<br>`;
  }

  function editTaskInfo(newTaskValues) {
    // newValues is the saved object from future edit form fields
    for (let key in newTaskValues) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = newTaskValues[key];
      }
    }
  }

  return {
    id,
    title,
    description,
    dueDate,
    priority,
    editTaskInfo,
    printBasicTaskInfo,
    printTaskDescription,
  };
};

export { User };
