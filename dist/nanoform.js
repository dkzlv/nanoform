import { deepMap, getPath, onStart, onSet, listenKeys, onStop } from "nanostores";
const nanoform = (initial) => {
  const fields = /* @__PURE__ */ new Map();
  const $form = deepMap(initial);
  $form.getField = (key) => {
    const created = fields.get(key);
    if (created)
      return created;
    const $field = deepMap(getPath($form.get(), key));
    fields.set(key, $field);
    let unsub = () => {
    }, onsubField = () => {
    };
    onStart($field, () => {
      $field.set(getPath($form.get(), key));
      let prevValue;
      onsubField = onSet($field, ({ newValue }) => {
        prevValue = newValue;
        $form.setKey(key, newValue);
      });
      unsub = listenKeys($form, [key], (value) => {
        const newValue = getPath(value, key);
        if (newValue !== prevValue) {
          prevValue = newValue;
          $field.set(newValue);
        }
      });
    });
    onStop($field, () => {
      unsub();
      onsubField();
    });
    return $field;
  };
  return $form;
};
function withOnChange(store) {
  const orig = store.getField;
  store.getField = (key) => {
    const field = orig(key);
    field.onChange = (e) => {
      const target = e == null ? void 0 : e.currentTarget;
      if (!target || !("value" in target))
        return;
      let value;
      switch (target.type) {
        case "date":
        case "month":
        case "week":
          value = target.valueAsDate;
          break;
        case "number":
        case "range":
          value = target.valueAsNumber;
          break;
        case "checkbox":
          value = target.checked;
          break;
        default:
          value = target.value;
      }
      field.set(value);
    };
    return field;
  };
  return store;
}
function formatDate(d) {
  if (!d)
    return "";
  const month = ("" + (d.getMonth() + 1)).padStart(2, "0"), day = ("" + d.getDate()).padStart(2, "0"), year = d.getFullYear();
  return [year, month, day].join("-");
}
function withOnSubmit(store, callback) {
  let submitting = false;
  store.onSubmit = async (e) => {
    e == null ? void 0 : e.preventDefault();
    if (submitting)
      return;
    submitting = true;
    try {
      await callback(store.value, e);
    } finally {
      submitting = false;
    }
  };
  return store;
}
export {
  formatDate,
  nanoform,
  withOnChange,
  withOnSubmit
};
