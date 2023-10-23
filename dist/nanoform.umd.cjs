(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("nanostores")) : typeof define === "function" && define.amd ? define(["exports", "nanostores"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.nanoform = {}, global.nanostores));
})(this, function(exports2, nanostores) {
  "use strict";
  const nanoform = (initial, onSubmit) => {
    const fields = /* @__PURE__ */ new Map();
    const $form = nanostores.deepMap(initial);
    $form.getField = (key) => {
      const created = fields.get(key);
      if (created)
        return created;
      const $field = nanostores.deepMap(nanostores.getPath($form.get(), key));
      $field.onChange = (e) => {
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
        $field.set(value);
      };
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
    let submitting = false;
    $form.onSubmit = async (e) => {
      e == null ? void 0 : e.preventDefault();
      if (submitting)
        return;
      submitting = true;
      try {
        await (onSubmit == null ? void 0 : onSubmit($form.value));
      } finally {
        submitting = false;
      }
    };
    return $form;
  };
  function formatDate(d) {
    if (!d)
      return "";
    const month = ("" + (d.getMonth() + 1)).padStart(2, "0"), day = ("" + d.getDate()).padStart(2, "0"), year = d.getFullYear();
    return [year, month, day].join("-");
  }
  exports2.formatDate = formatDate;
  exports2.nanoform = nanoform;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
