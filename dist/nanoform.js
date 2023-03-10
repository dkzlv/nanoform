import { atom, onSet, onStart, listenKeys, onStop } from "nanostores";
const getPath = (obj, path) => {
  const allKeys = getAllKeysFromPath(path);
  let res = obj;
  for (const key of allKeys) {
    if (res === void 0)
      break;
    res = res[key];
  }
  return res;
};
function setPath(obj, path, value) {
  return setByKey(obj != null ? obj : {}, getAllKeysFromPath(path), value);
}
function setByKey(obj, splittedKeys, value) {
  let key = splittedKeys[0];
  ensureKey(obj, key, splittedKeys[1]);
  let copy = Array.isArray(obj) ? [...obj] : { ...obj };
  if (splittedKeys.length === 1) {
    if (value === void 0) {
      if (Array.isArray(obj)) {
        copy.splice(key, 1);
      } else {
        delete copy[key];
      }
    } else
      copy[key] = value;
    return copy;
  }
  const newVal = setByKey(obj[key], splittedKeys.slice(1), value);
  obj[key] = newVal;
  return obj;
}
const arrayIndexFinderRegex = /(.*)\[(\d+)\]/;
function getAllKeysFromPath(path) {
  return path.split(".").flatMap((key) => {
    if (arrayIndexFinderRegex.test(key)) {
      let res = key.match(arrayIndexFinderRegex);
      return res.slice(1);
    }
    return [key];
  });
}
function ensureKey(obj, key, nextKey) {
  if (key in obj) {
    return;
  }
  let nextKeyAsInt = parseInt(
    nextKey !== null && nextKey !== void 0 ? nextKey : ""
  );
  if (Number.isNaN(nextKeyAsInt)) {
    obj[key] = {};
  } else {
    obj[key] = Array(nextKeyAsInt + 1).fill(void 0);
  }
}
function deepMap(initial) {
  let store = atom(initial);
  store.setKey = (key, value) => {
    if (getPath(store.value, key) !== value) {
      store.value = setPath(store.value, key, value);
      store.notify(key);
    }
  };
  return store;
}
const nanoform = (initial) => {
  const fields = /* @__PURE__ */ new Map();
  const $form = deepMap(initial);
  $form.getField = (key) => {
    const created = fields.get(key);
    if (created)
      return created;
    const store = deepMap(getPath($form.get(), key));
    fields.set(key, store);
    const unsubField = onSet(store, ({ newValue }) => {
      $form.setKey(key, newValue);
    });
    let unsub = () => {
    };
    onStart(store, () => {
      unsub = listenKeys($form, [key], (value) => {
        const newVal = getPath(value, key);
        if (newVal !== store.value) {
          store.set(newVal);
        }
      });
    });
    onStop(store, () => {
      unsub();
      unsubField();
    });
    return store;
  };
  return $form;
};
export {
  deepMap,
  getPath,
  nanoform,
  setPath
};
