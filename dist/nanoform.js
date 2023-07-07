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
export {
  nanoform
};
