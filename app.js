AddWithEnter();
let counter = 0;
let inputTodo = {};
let todoList = [];
let currentFilter = 'all';
let toCreate = document.querySelector('.toCreate');
toCreate.addEventListener('click', createTodoList);
document.querySelector(".nightAndDay").addEventListener('click', changeIcon);
document.querySelector(".popup").addEventListener('click', myPopup);

function myPopup() {
  let popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

function createTodoList() {
  inputTodo = {
    id: counter++,
    value: '',
    completed: false,
  }
  inputTodo.value = document.querySelector('.input').value;
  if (inputTodo.value === '') {
    myPopup();
  } else {
    todoList.push(inputTodo);
    displayTodoList();
  }
}

function todosCounter(todoList) {
  todoList = todoList.filter(todo => { return todo.completed == false });
  document.querySelector('.itemsLeft').innerText = `${todoList.length} Items left`;
}

document.querySelector('.all').addEventListener('click', () => { currentFilter = 'all'; displayTodoList(); });
document.querySelector('.active').addEventListener('click', () => { currentFilter = 'active'; displayTodoList(); });
document.querySelector('.completed').addEventListener('click', () => { currentFilter = 'completed'; displayTodoList(); });
document.querySelector('.clearTodos').addEventListener('click', () => { removeCompleted(); displayTodoList(); });

function filterTodoList(filter) {
  let filteredList = [];
  document.querySelector('.focused').classList.remove('focused');
  if (filter == 'active') {
    document.querySelector('.active').classList.add('focused');
    filteredList = todoList.filter(todo => { return todo.completed == false });
  } else if (filter == 'completed') {
    document.querySelector('.completed').classList.add('focused');
    filteredList = todoList.filter(todo => { return todo.completed == true });
  } else if (filter == 'all') {
    document.querySelector('.all').classList.add('focused');
    return todoList;
  }
  return filteredList;
}

function removeCompleted() {
  todoList = todoList.filter(todo => { return todo.completed == false });
}



function displayTodoList() {
  document.querySelector('.items').innerHTML = '';
  let filteredList = filterTodoList(currentFilter);
  todosCounter(filteredList);
  let newTodo = '';
  for (let i = 0; i < filteredList.length; i++) {
    newTodo = `<div class="draggable" draggable = "true">
  <div class="todoItem" data-id="${filteredList[i].id}" > 
     <button class="btn">   
          <div data-type="completedBox" class="circle dynamic">
              <svg class="marked" xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                <path fill="transparent" stroke="#fff" stroke-width="3" d="M1 4.304L3.696 7l6-6" />
              </svg>
            </div> 
       </button>      
    <p class="itemContent">${filteredList[i].value}</p>
    <div class="removeTodo">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
        <path fill="" fill-rule="evenodd"
          d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
      </svg>
    </div>
    </div>
    <hr/>
    </div>`
    document.querySelector('.items').innerHTML += newTodo;
  }
  document.querySelector('.input').value = '';
  drawCompleted(filteredList);
  let removeRows = document.querySelectorAll('.removeTodo');
  removeRows.forEach(removeRow => {
    removeRow.addEventListener('click', removeTodo);
  })
  let currentTodos = document.querySelectorAll('div[data-type ="completedBox"]');
  currentTodos.forEach(currentTodo => {
    currentTodo.addEventListener('click', completeTodo);
  })
  sortingTheList();
}

function completeTodo(e) {
  let clickedTodo = e.currentTarget.parentElement.parentElement.getAttribute('data-id');
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == clickedTodo) {
      todoList[i].completed = !todoList[i].completed;
    }
  }
  displayTodoList();
}

function removeTodo(e) {
  let toRemove = e.currentTarget.parentElement.getAttribute('data-id');
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == toRemove) {
      todoList.splice(i, 1);
    }
  }
  displayTodoList();
}


function drawCompleted(filteredList) {
  for (let i = 0; i < filteredList.length; i++) {
    if (filteredList[i].completed == true) {
      document.querySelector(`div[data-id='${filteredList[i].id}']`).querySelector('.dynamic').classList.add('done');
      document.querySelector(`div[data-id='${filteredList[i].id}']`).querySelector('.marked').classList.add('tick');
      document.querySelector(`div[data-id='${filteredList[i].id}']`).querySelector('.itemContent').classList.add('disabled');
    } else {
      document.querySelector(`div[data-id='${filteredList[i].id}']`).querySelector('.dynamic').classList.remove('done');
      document.querySelector(`div[data-id='${filteredList[i].id}']`).querySelector('.marked').classList.remove('tick');
      document.querySelector(`div[data-id='${filteredList[i].id}']`).querySelector('.itemContent').classList.remove('disabled');
    }
  }
}



function AddWithEnter() {
  let input = document.querySelector(".input");
  input.addEventListener("keyup", function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      createTodoList();
    }
  });
}

let toggler = document.querySelector(".nightAndDay");
toggler.addEventListener('click', changeIcon);

function changeIcon() {
  toggler.classList.toggle('fa-sun');
  toggler.classList.toggle('fa-moon');
  document.querySelector('.hero').classList.toggle('darkHero');
}

function sortingTheList() {
  const draggables = document.querySelectorAll('.draggable')
  const containers = document.querySelectorAll('.items')

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging')
    })
  })

  containers.forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault()
      const afterElement = getDragAfterElement(container, e.clientY)
      const draggable = document.querySelector('.dragging')
      if (afterElement == null) {
        container.appendChild(draggable)
      } else {
        container.insertBefore(draggable, afterElement)
      }
    })
  })

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element
  }
}

