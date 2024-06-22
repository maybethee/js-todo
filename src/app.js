// import './style.css'

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
    project.displayProjectTasks()
  });
}

function deleteProject(projectId) {
  projects.splice(projectId, 1)
}

const TodoItem = (title, description, dueDate, priority) => {
  function printTaskInfo() {
    console.log(`${this.title}\n${this.description}\ndue: ${this.dueDate}\npriority: ${this.priority}`);
  }

  function editTaskInfo(newValues) {
    // newValues is the saved object from future edit form fields
    for (let key in newValues) {
      if (this.hasOwnProperty(key)) {
        this[key] = newValues[key];
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
  const tasks = []

  function addTask(task) {
    this.tasks.push(task)
  }

  function displayProjectInfo() {
    console.log(`Project: ${this.name}\nDescription: ${this.description}`)
  }


  function editProjectInfo(newValues) {
    for (let key in newValues) {
      if (this.hasOwnProperty(key)) {
        this[key] = newValues[key];
      }
    }
  }

  function displayProjectTasks() {
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
    displayProjectTasks
  }
}

// new project
const movingHouse = Project('MOVING', 'this fall!!')

addProject(movingHouse)

const packing = TodoItem('packing', "don't forget kitchen stuff!", '10-10-2030', 'urgent');
const donateStuff = TodoItem('donate stuff!', "old clothes, etc.", '10-9-2030', 'urgent');

movingHouse.addTask(packing);
movingHouse.addTask(donateStuff)

// new project
const researchPaper = Project('English Paper', 'on Fitzgerald et al')

addProject(researchPaper)

const roughDraft = TodoItem('rough draft', '10 pages double spaced MLA format + bibliography', '11-2-2024', 'urgent');
const finalDraft = TodoItem('final draft', '10 pages double spaced MLA format + bibliography', '11-2-2024','not urgent');

researchPaper.addTask(roughDraft)
researchPaper.addTask(finalDraft)

displayAll();
