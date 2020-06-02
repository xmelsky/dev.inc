/* eslint-disable no-param-reassign */
import { getLocalStorage } from './js/utils/localStorage';
import actions, { getTodoHTML } from './js/utils/actions';

const currentTasks = document.getElementById('currentTasks');
const completedTasks = document.getElementById('completedTasks');

const colors = getLocalStorage('colors') || {};

document.body.style.backgroundColor = colors.bg;
document.body.style.color = colors.color;

let activeTasks = {};
let inactiveTasks = {};
let sortedActive = [];
let sortedCompleted = [];

function render(todos) {
  currentTasks.innerHTML = null;
  completedTasks.innerHTML = null;

  activeTasks = getLocalStorage('active');
  inactiveTasks = getLocalStorage('completed');

  if (todos) {
    const [active, completed] = todos;
    sortedActive = active;
    sortedCompleted = completed;
  } else {
    sortedActive = [];
    sortedCompleted = [];
  }

  if (activeTasks && Object.keys(activeTasks).length) {
    Object.values(activeTasks).forEach((task, i) => {
      if (!task.completed) {
        const todo = getTodoHTML(sortedActive.length ? sortedActive[i][1] : task);
        task.html = todo;
        currentTasks.appendChild(todo);
      }
    });
    document.getElementById('todo-title').firstElementChild.innerHTML = ` (${Object.keys(activeTasks).length})`;
  } else {
    document.getElementById('todo-title').firstElementChild.innerHTML = null;
    currentTasks.innerHTML = '<li class="list-group-item d-flex w-100 mb-2">There is no active tasks yet</li>';
  }
  if (inactiveTasks && Object.keys(inactiveTasks).length) {
    Object.values(inactiveTasks).forEach((task, i) => {
      if (task.completed) {
        const todo = getTodoHTML(sortedCompleted.length ? sortedCompleted[i][1] : task);
        task.html = todo;
        completedTasks.appendChild(todo);
      }
    });
    document.getElementById('completed-title').firstElementChild.innerHTML = ` (${Object.keys(inactiveTasks).length})`;
  } else {
    document.getElementById('completed-title').firstElementChild.innerHTML = null;
    completedTasks.innerHTML = '<li class="list-group-item d-flex w-100 mb-2">There is no completed tasks yet</li>';
  }

  const appColors = getLocalStorage('colors') || {};
  const form = document.getElementById('app-colors');
  form.elements[0].value = appColors.bg;
  form.elements[1].value = appColors.color;
}

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
    e.preventDefault();
    const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
    if (button.dataset.action) {
      const { action } = button.dataset;
      let sorted;
      switch (action) {
        case 'complete':
          actions[button.dataset.action](button.dataset.id, activeTasks);
          return render();
        case 'edit':
          actions[button.dataset.action](button.dataset.id, activeTasks);
          return render();
        case 'save':
          actions[button.dataset.action](button);
          return render();
        case 'delete':
          actions[button.dataset.action](button.dataset.id);
          return render();
        case 'sort':
          sorted = actions[button.dataset.action](button.dataset.direction);
          return render(sorted);
        case 'color':
          sorted = actions[button.dataset.action](button.closest('form'));
          return render(sorted);

        default:
      }
      actions[button.dataset.action](button);
      render();
    }
  }
});

render();
