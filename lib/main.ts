import {
  listenKeys,
  onSet,
  onStart,
  onStop,
  deepMap,
  getPath,
} from "nanostores";
import type {
  DeepMapStore,
  AllPaths,
  FromPath,
  BaseDeepMap,
  WritableAtom,
} from "nanostores";

export type FieldStore<T, K> = FromPath<T, K> extends BaseDeepMap
  ? DeepMapStore<FromPath<T, K>>
  : WritableAtom<FromPath<T, K>>;
export type FormStore<T extends BaseDeepMap> = DeepMapStore<T> & {
  getField: <K extends AllPaths<T>>(key: K) => FieldStore<T, K>;
};

export const nanoform = <T extends BaseDeepMap>(initial: T): FormStore<T> => {
  const fields = new Map<AllPaths<T>, any>();

  const $form = deepMap(initial) as any;
  $form.getField = (key: AllPaths<T>) => {
    const created = fields.get(key);
    if (created) return created;

    const $field = deepMap(getPath($form.get(), key));
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

  return $form;
};
