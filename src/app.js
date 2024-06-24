const User = () => {
  let newProjectId = 1;
  const projects = [];

  let currentProjectId = null;

  function setCurrentProject(id) {
    currentProjectId = id - 1;
  }

  function getCurrentProject() {
    return projects[currentProjectId];
  }

  function addProject(formData) {
    const newProject = Project(formData.name, formData.description, newProjectId++);
    console.log(`new project name: ${newProject.name},\nNew project description: ${newProject.description}`)
    
    projects.push(newProject);
  }
  
  function displayAllProjects() {
    projects.forEach(project => console.log(`Project: ${project.name}\nDescription: ${project.description}`));
  }
  
  function displayAll() {
    projects.forEach(project => {
      console.log('displaying project info')
      project.displayProjectInfo()
      console.log('displaying tasks')
      project.logProjectTasks()
    });
  }
  
  function deleteProject(projectId) {
    projects.splice(projectId, 1)
  }

  (function addDefaultProject() {
    const defaultProject = Project("Personal", "Your first project", newProjectId++);
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
    displayAll
  }
}

const Task = (title, description, dueDate, priority, id) => {
  function printTaskInfo() {
    console.log(`${this.title}\n${this.description}\ndue: ${this.dueDate}\npriority: ${this.priority}`);

    return `${this.title}\n${this.description}\ndue: ${this.dueDate}\npriority: ${this.priority}`;
  }

  function editTaskInfo(newTaskValues) {
    // newValues is the saved object from future edit form fields
    for (let key in newTaskValues) {
      if (this.hasOwnProperty(key)) {
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
    printTaskInfo
  }
}

const Project = (name, description, id) => {
  let newTaskId = 1;
  const tasks = [];

  function addTask(formData) {
    // this should be done more dynamically
    const newTask = Task(formData.title, formData.description, formData.dueDate, formData.priority, newTaskId++)
    this.tasks.push(newTask);
  }

  function displayProjectInfo() {
    console.log(`Project: ${this.name}\nDescription: ${this.description}`);
    return `Project: ${this.name}\nDescription: ${this.description}`;
  }

  function editProjectInfo(newValues) {
    for (let key in newValues) {
      if (this.hasOwnProperty(key)) {
        this[key] = newValues[key];
      }
    }
  }

  function logProjectTasks() {
    // list tasks in that project's array
    this.tasks.forEach(task => task.printTaskInfo());
  }

  function deleteTask(taskId) {
    this.tasks.splice(taskId, 1);
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
    logProjectTasks
  }
}

export { User, Task, Project }