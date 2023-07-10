(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("nanostores")) : typeof define === "function" && define.amd ? define(["exports", "nanostores"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.nanoform = {}, global.nanostores));
})(this, function(exports2, nanostores) {
  "use strict";
  const nanoform = (initial) => {
    const fields = /* @__PURE__ */ new Map();
    const $form = nanostores.deepMap(initial);
    $form.getField = (key) => {
      const created = fields.get(key);
      if (created)
        return created;
      const $field = nanostores.deepMap(nanostores.getPath($form.get(), key));
      fields.set(key, $field);
      let unsub = () => {
      }, onsubField = () => {
      };
      nanostores.onStart($field, () => {
        $field.set(nanostores.getPath($form.get(), key));
        let prevValue;
        onsubField = nanostores.onSet($field, ({ newValue }) => {
          prevValue = newValue;
          $form.setKey(key, newValue);
        });
        unsub = nanostores.listenKeys($form, [key], (value) => {
          const newValue = nanostores.getPath(value, key);
          if (newValue !== prevValue) {
            prevValue = newValue;
            $field.set(newValue);
          }
        });
      });
      nanostores.onStop($field, () => {
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
        if (!target)
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
  function withOnSubmit(store, callback) {
    let submitting = false;
    store.onSubmit = async (e) => {
      e.preventDefault();
      if (submitting)
        return;
      submitting = true;
      callback(store.value, e).finally(() => submitting = false);
    };
    return store;
  }
  exports2.nanoform = nanoform;
  exports2.withOnChange = withOnChange;
  exports2.withOnSubmit = withOnSubmit;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
