import { WritableAtom } from "nanostores";
import { FormStoreWithOnChange } from "./types";

export function withOnChange<T>(
  store: WritableAtom<T> & { getField: (...args: any[]) => any }
): FormStoreWithOnChange<T> {
  const orig = store.getField;
  store.getField = (key) => {
    const field = orig(key);
    type Return = typeof field & { onChange: (e?: any) => void };
    (field as Return).onChange = (e: any) => {
      const target = e?.currentTarget;
      if (!target) return;

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
          // Covers select, select multiple, textarea, text, email, password, search, tel, url
          // datetime-local, time, color, hidden, radio
          value = target.value;
      }
      field.set(value);
    };
    return field as Return;
  };
  return store;
}
