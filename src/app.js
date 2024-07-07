import { format, parseISO } from "date-fns";

class User {
  constructor() {
    this.newProjectId = 1;
    this.projects = [];
    this.currentProjectId = null;
    this.addDefaultProject();
  }

  setCurrentProject(id) {
    this.currentProjectId = id;
  }

  getCurrentProject() {
    return this.projects.find(
      (projects) => projects.id === this.currentProjectId
    );
  }

  getCurrentProjectId() {
    return this.projects.findIndex(
      (projects) => projects.id === this.currentProjectId
    );
  }

  addProject(formData) {
    const newProject = new Project(
      formData.name,
      formData.description,
      this.newProjectId++
    );
    this.projects.push(newProject);
  }

  displayAllProjects() {
    this.projects.forEach((project) =>
      console.log(
        `Project: ${project.name}\nDescription: ${project.description}`
      )
    );
  }

  displayAll() {
    this.projects.forEach((project) => {
      console.log("displaying project info");
      project.displayProjectInfo();
      console.log("displaying tasks:");
      project.logProjectTasks();
    });
  }

  deleteProject(projectId) {
    const index = this.projects.findIndex(
      (project) => project.id === projectId
    );
    if (index !== -1) {
      this.projects.splice(index, 1);
    }
  }

  addDefaultProject() {
    const defaultProject = new Project(
      "Personal",
      "Your first project",
      this.newProjectId
    );
    this.projects.push(defaultProject);
    this.setCurrentProject(this.newProjectId);
    this.newProjectId++;
  }

  saveToLocalStorage() {
    const data = {
      newProjectId: this.newProjectId,
      projects: this.projects.map((project) => project.getData()),
      currentProjectId: this.currentProjectId,
    };
    localStorage.setItem("user", JSON.stringify(data));
  }

  static loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("user"));

    // return a new User when no saved data found
    if (!data) {
      return new User();
    }

    const currentUser = new User();

    currentUser.newProjectId = data.newProjectId;
    currentUser.projects = data.projects.map((projectData) =>
      Project.loadFromData(projectData)
    );

    currentUser.currentProjectId = data.currentProjectId;

    if (currentUser.projects.length === 0) {
      currentUser.addDefaultProject();
    }

    return currentUser;
  }
}

class Project {
  constructor(name, description, id) {
    this.name = name;
    this.description = description;
    this.id = id;
    this.tasks = [];
    this.newTaskId = 1;
  }

  addTask(formData) {
    // this should maybe be done more dynamically
    const newTask = new Task(
      formData.title,
      formData.description,
      formData.dueDate,
      formData.priority,
      this.newTaskId++
    );

    this.tasks.push(newTask);
  }

  displayProjectInfo() {
    console.log(`Project: ${this.name}\nDescription: ${this.description}`);
    return `Project: ${this.name}\nDescription: ${this.description}`;
  }

  editProjectInfo(newValues) {
    for (let key in newValues) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = newValues[key];
      }
    }
  }

  logProjectTasks() {
    // list tasks in its project's array
    this.tasks.forEach((task) => task.printTaskInfo());
  }

  deleteTask(taskId) {
    const index = this.tasks.findIndex((task) => task.id === taskId);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  getData() {
    return {
      name: this.name,
      description: this.description,
      id: this.id,
      tasks: this.tasks,
    };
  }

  static loadFromData(data) {
    const project = new Project(
      data.name,
      data.description,
      data.id,
      data.tasks
    );
    project.tasks = data.tasks.map((taskData) => Task.loadFromData(taskData));
    return project;
  }
}

class Task {
  constructor(title, description, dueDate, priority, id) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.id = id;
  }

  printBasicTaskInfo() {
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

  printTaskDescription() {
    console.log(`${this.description}<br>priority: ${this.priority}`);

    return `${this.description}<br>`;
  }

  editTaskInfo(newTaskValues) {
    // newValues is the saved object from future edit form fields
    for (let key in newTaskValues) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = newTaskValues[key];
      }
    }
  }

  getData() {
    return {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
    };
  }

  static loadFromData(data) {
    const task = new Task(
      data.title,
      data.description,
      data.dueDate,
      data.priority
    );
    return task;
  }
}

export { User };
