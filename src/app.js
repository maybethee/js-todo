// import './style.css'

console.log('connected');

const TodoItem = (newTitle, newDescription) => {
  const title = newTitle;
  const description = newDescription;

  function printInfo() {
    console.log(`${title}: ${description}`);
  }

  return {
    printInfo
  }
}

const newItem = TodoItem('new title', 'new description');

newItem.printInfo();
