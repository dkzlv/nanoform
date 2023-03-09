import { atom, WritableAtom } from "nanostores";
import { AllKeys, FromPath, getPath, setPath } from "./path";

type ListenFn<V> = (
  listener: (value: V, changedKey: undefined | AllKeys<V>) => void
) => () => void;

type DeepMap<T> = {
  value: T;
  setKey: <K extends AllKeys<T>>(key: K, value: FromPath<T, K>) => void;
  listen: ListenFn<T>;
  subscribe: ListenFn<T>;
};

export type DeepMapStore<T> = Omit<WritableAtom<T>, keyof DeepMap<any>> &
  DeepMap<T>;

export function deepMap<T extends Record<string, unknown>>(initial: T) {
  let store = atom(initial) as DeepMapStore<T>;
  store.setKey = (key, value) => {
    if (getPath(store.value, key) !== value) {
      store.value = setPath(store.value, key, value);
      store.notify(key as any);
    }
  };
  return store;
}
