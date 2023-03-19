import { listenKeys, onSet, onStart, onStop } from "nanostores";
import { deepMap, DeepMapStore } from "./utils/deepMap";
import { AllKeys, FromPath, getPath } from "./utils/path";

export type FieldStore<T> = DeepMapStore<T> & {
  onChange: (e: { currentTarget?: EventTarget | null }) => void;
};
export type FormStore<T> = DeepMapStore<T> & {
  getField: <K extends AllKeys<T>>(key: K) => FieldStore<FromPath<T, K>>;
};

export const nanoform = <T extends Record<string, unknown>>(initial: T) => {
  const fields = new Map<AllKeys<T>, FieldStore<any>>();

  const $form = deepMap(initial) as FormStore<T>;
  $form.getField = (key) => {
    const created = fields.get(key);
    if (created) return created;

    const store = deepMap(getPath($form.get(), key)) as FieldStore<any>;
    store.onChange = (e) => {
      const target = e.currentTarget as HTMLInputElement;
      if (!target) return;

      if (target.type === "date") store.set(target.valueAsDate);
      else if (target.type === "number") store.set(target.valueAsNumber);
      else store.set(target.value);
    };
    fields.set(key, store);

    const unsubField = onSet(store, ({ newValue }) => {
      $form.setKey(key, newValue);
    });
    let unsub = () => {};
    onStart(store, () => {
      unsub = listenKeys($form as any, [key], (value) => {
        const newVal = getPath(value, key)!;
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

export { setPath, getPath } from "./utils/path";
export { deepMap } from "./utils/deepMap";
