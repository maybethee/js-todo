import {  User, TodoItem, Project } from "./app";

const ScreenController = () => {
  const contentDiv = document.querySelector("#content");
  // const newProjectBtn = document.querySelector("#new-project");
  // const newProjectDialog = document.getElementById("newProjectDialog");
  const newTaskBtn = document.querySelector("#new-task");

  const newTaskDialog = document.getElementById("newTaskDialog");

  newTaskBtn.addEventListener("click", () => {

    newTaskDialog.showModal()
  })

  function getFormInfo() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    return { title, description, dueDate, priority };

  }

  confirmBtn.addEventListener("click", (event) => {
    event.preventDefault();
  
    // return form info?

    getFormInfo();

    // add task

    // should eventually use whatever the current project is instead of researchPaper
    researchPaper.addTask(getFormInfo());
    contentDiv.textContent = '';
    screen.displayProjectTasks(researchPaper);

  
    newTaskDialog.close();
  });

  function displayProjectTasks(project) {
    project.tasks.forEach(task => {
      const newTaskElement = document.createElement('p');
  
      newTaskElement.innerHTML = task.printTaskInfo();
  
      contentDiv.appendChild(newTaskElement);
    })
  }

  return {
    contentDiv,
    newTaskBtn,
    getFormInfo,
    displayProjectTasks
  }
}

// const currentUser = User();

const screen = ScreenController();

const researchPaper = Project('English Paper', 'on Fitzgerald et al');
