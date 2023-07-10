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

export type FormStoreWithOnChange<T extends FormStore<any>> = T & {
  getField: <K extends AllPaths<T>>(
    key: K
  ) => T["getField"] & {
    onChange: (e: any) => void;
  };
};
