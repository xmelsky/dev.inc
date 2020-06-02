/* eslint-disable no-param-reassign */
import create from './create';
import { getLocalStorage, setLocalStorageItem } from './localStorage';

export function createId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getTodoHTML({
  id, title, text, timestamp, priority, completed, color,
}) {
  const str = text.replace(/(.*)<(.*)>(.*)/g, '$1$&lg;$2&gt;$3');
  const date = new Date(timestamp);
  const todo = create('li', 'list-group-item d-flex w-100 mb-2', [
    create('div', 'w-100 mr-2', [
      create('div', 'd-flex w-100 justify-content-between', [
        create('h5', 'mb-1', title, null, ['style', `color: ${color}`]),
        create('div', 'mb-1', [
          create('small', 'mr-2', priority),
          create('small', '', `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()}
           ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()}`),
        ]),
      ]),
      create('p', 'mb-1 w-100', str),
    ]),
    create('div', 'dropdown m-2 dropleft', [
      create('button', 'btn btn-secondary h-100', [
        create('i', 'fas fa-ellipsis-v', null, null, ['aria-hidden', 'true']),
      ], null,
      ['type', 'button'],
      ['id', 'dropdownMenuItem1'],
      ['toggle', 'dropdown'],
      ['aria-haspopup', 'true'],
      ['aria-expanded', 'false']),
      create('div', 'dropdown-menu p-2 flex-column', [
        create('button', 'btn btn-success w-100', 'Complete', null,
          ['type', 'button'],
          ['data-id', id],
          ['action', 'complete']),
        create('button', 'btn btn-info w-100 my-2', 'Edit', null,
          ['type', 'button'],
          ['data-id', id],
          ['action', 'edit'],
          completed && completed === true ? ['disabled', 'true'] : ['']),
        create('button', 'btn btn-danger w-100', 'Delete', null,
          ['type', 'button'],
          ['data-id', id],
          ['action', 'delete']),
      ], null, ['aria-labelledby', 'dropdownMenuItem1']),
    ]),
  ]);
  return todo;
}

function addTask(target) {
  const form = target.closest('form');
  const title = form.elements[1].value;
  const text = form.elements[2].value;
  const color = form.elements[3].value;
  const priority = form.elements[4].querySelector('input:checked');
  if (!title || !text || !priority) return alert('You must fill all fields');

  let active = getLocalStorage('active');
  if (!active) {
    active = {};
  }

  const id = createId(9);
  active[id] = {
    id, title, text, priority: priority.value, color, timestamp: Date.now(),
  };
  setLocalStorageItem('active', active);
  form.reset();
  window.$('#exampleModal').modal('hide');
  return true;
}

function completeTask(id) {
  const activeList = getLocalStorage('active') || {};
  const task = activeList[id];
  if (task) {
    delete activeList[id];
    setLocalStorageItem('active', activeList);
    const completed = getLocalStorage('completed') || {};
    task.completed = true;
    completed[id] = task;
    setLocalStorageItem('completed', completed);
  }
}

function editTask(id, activeTasks) {
  const {
    title, text, priority, color,
  } = activeTasks[id];
  const form = document.getElementById('edit-form');
  form.elements[1].value = title;
  form.elements[2].value = text;
  form.elements[3].value = color;
  form.elements[4].querySelector(`[data-id=${priority}]`).checked = true;
  form.elements[9].dataset.id = id;
  window.$('#exampleModal2').modal('show');
}

function saveTask(button) {
  const { id } = button.dataset;
  const active = getLocalStorage('active');
  const form = button.closest('form');
  const title = form.elements[1].value;
  const text = form.elements[2].value;
  const color = form.elements[3].value;
  const priority = form.elements[4].querySelector('input:checked');
  if (!title || !text || !priority) return alert('You must fill all fields');
  active[id].title = title;
  active[id].text = text;
  active[id].color = color;
  active[id].priority = priority.value;
  setLocalStorageItem('active', active);
  form.reset();
  window.$('#exampleModal2').modal('hide');
  return true;
}

function deleteTask(id) {
  const active = getLocalStorage('active');
  delete active[id];
  const completed = getLocalStorage('completed');
  delete completed[id];
  setLocalStorageItem('active', active);
  setLocalStorageItem('completed', completed);
}

function sortTasks(direction) {
  const active = getLocalStorage('active');
  const completed = getLocalStorage('completed');
  let activeArray;
  let completeArray;

  switch (direction) {
    case 'asc':
      activeArray = active && Object.entries(active).sort((a, b) => a[1].timestamp - b[1].timestamp);
      completeArray = completed && Object.entries(completed).sort((a, b) => a[1].timestamp - b[1].timestamp);
      break;
    case 'desc':
      activeArray = active && Object.entries(active).sort((a, b) => b[1].timestamp - a[1].timestamp);
      completeArray = completed && Object.entries(completed).sort((a, b) => b[1].timestamp - a[1].timestamp);
      break;
    default:
  }
  return [activeArray, completeArray];
}

export default {
  save: saveTask,
  edit: editTask,
  complete: completeTask,
  add: addTask,
  delete: deleteTask,
  sort: sortTasks,
};
