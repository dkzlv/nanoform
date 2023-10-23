import {
  listenKeys,
  onSet,
  onStart,
  onStop,
  deepMap,
  getPath,
  type BaseDeepMap,
  type AllPaths,
} from "nanostores";
import type { FormStore, FieldStore } from "./types";

export { FormStore, FieldStore };

export const nanoform = <T extends BaseDeepMap>(
  initial: T,
  onSubmit?: (data: T) => Promise<any> | any
): FormStore<T> => {
  const fields = new Map<AllPaths<T>, any>();

  const $form = deepMap(initial) as any;
  $form.getField = (key: AllPaths<T>) => {
    const created = fields.get(key);
    if (created) return created;

    const $field = deepMap(getPath($form.get(), key)) as any;
    $field.onChange = (e?: { currentTarget: unknown }) => {
      const target = e?.currentTarget as HTMLInputElement | undefined;
      if (!target || !("value" in target)) return;

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
      $field.set(value);
    };
    fields.set(key, $field);

    let unsub = () => {},
      onsubField = () => {};

    onStart($field, () => {
      $field.set(getPath($form.get(), key));

      let prevValue: any;
      onsubField = onSet($field, ({ newValue }) => {
        console.log(key, "setting to", newValue);

        prevValue = newValue;
        $form.setKey(key, newValue);
      });

      unsub = listenKeys($form as any, [key], (value) => {
        const newValue = getPath(value, key)!;
        if (newValue !== prevValue) {
          console.log(key, "update from form", newValue);

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

  let submitting = false;
  $form.onSubmit = async (e?: any) => {
    e?.preventDefault();

    if (submitting) return;
    submitting = true;
    try {
      await onSubmit?.($form.value);
    } finally {
      submitting = false;
    }
  };

  return $form;
};

export function formatDate(d?: Date): string {
  if (!d) return "";

  const month = ("" + (d.getMonth() + 1)).padStart(2, "0"),
    day = ("" + d.getDate()).padStart(2, "0"),
    year = d.getFullYear();

  return [year, month, day].join("-");
}
