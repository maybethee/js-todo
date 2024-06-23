// import './style.css'

const User = () => {
  const projects = [];

  function addProject(project) {
      projects.push(project)
  }
  
  function displayAllProjects(projectArr) {
    projectArr.forEach(project => console.log(`Project: ${project.name}\nDescription: ${project.description}`));
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
  
  return {
    projects,
    addProject,
    displayAllProjects,
    displayAll
  }
}

const TodoItem = (title, description, dueDate, priority) => {
  function printTaskInfo() {
    console.log(`${this.title}\n${this.description}\ndue: ${this.dueDate}\npriority: ${this.priority}`);

    return `${this.title}<br>${this.description}<br>due: ${this.dueDate}<br>priority: ${this.priority}`;
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
    title,
    description,
    dueDate,
    priority,
    editTaskInfo,
    printTaskInfo
  }
}

const Project = (name, description) => {
  const tasks = [];

  function addTask(formData) {
    // this should be done more dynamically
    const newTask = TodoItem(formData.title, formData.description, formData.dueDate, formData.priority)
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

export { User, TodoItem, Project }