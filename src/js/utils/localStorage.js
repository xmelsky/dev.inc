
const LOCAL_STORAGE_NAME = 'my-todo';

function pushLocalStorage(storage) {
  window.localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(storage));
}

function findPathInObjectProps(obj, prop) {
  const row = Object.keys(obj);
  let path;
  for (let i = 0; i < row.length; i += 1) {
    path = [];
    const nextProp = row[i];
    if (nextProp === prop) return [...path, prop];
    if (typeof obj[nextProp] === 'object' && obj[nextProp] !== null) {
      path.push(nextProp);
      path = [...path, ...findPathInObjectProps(obj[nextProp], prop)];
      if (path[path.length - 1] === prop) return path;
    }
  }
  return path && path.length ? path : [prop];
}

function findInObject(obj, prop) {
  const path = findPathInObjectProps(obj, prop);
  if (!obj[prop]) return path.reduce((res, str) => res[str], obj);
  return obj[prop];
}

export function getLocalStorage(prop) {
  const ls = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME)) || {};
  if (!prop) return ls;
  return findInObject(ls, prop);
}

export function setLocalStorageItem(path, data) {
  const ls = getLocalStorage();
  const parsedPath = path.split('.').map((str) => str.trim());
  const prop = parsedPath.pop() || path;
  let destination = null;
  parsedPath.forEach((key) => {
    if (ls[key]) {
      destination = ls[key];
    } else {
      ls[key] = {};
      destination = ls[key];
    }
  });
  if (destination) {
    destination[prop] = data;
  } else {
    ls[prop] = data;
  }
  pushLocalStorage(ls);
}
