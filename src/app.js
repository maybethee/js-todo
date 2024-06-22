// import './style.css'

const TodoItem = (title, description, dueDate, priority) => {
  function printInfo() {
    console.log(`${this.title}\n${this.description}\ndue: ${this.dueDate}\npriority: ${this.priority}`);
  }

  return {
    title,
    description,
    dueDate,
    priority,
    printInfo
  }
}

const Project = (name, description) => {
  const tasks = []

  function addTask(task) {
    this.tasks.push(task)
  }

  function displayProject() {
    console.log(`Project: ${name}\nDescription: ${description}\ntasks:\n`)
    this.tasks.forEach(task => task.printInfo());
  }

  return {
    tasks,
    addTask,
    displayProject
  }
}

const movingHouse = Project('MOVING', 'this fall!!')
const packing = TodoItem('packing', "don't forget kitchen stuff!", '10-10-2030', 'urgent');
const donateStuff = TodoItem('donate stuff!', "old clothes, etc.", '10-9-2030', 'urgent');

movingHouse.addTask(packing);
movingHouse.addTask(donateStuff)

movingHouse.displayProject();

