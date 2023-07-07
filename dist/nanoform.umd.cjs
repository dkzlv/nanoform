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
  exports2.nanoform = nanoform;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
