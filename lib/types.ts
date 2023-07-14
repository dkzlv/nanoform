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

type OnChange = {
  onChange: (e: { currentTarget: unknown }) => void;
};
export type FormStoreWithOnChange<T> = WritableAtom<T> & {
  getField: <K extends AllPaths<T>>(key: K) => FieldStore<T, K> & OnChange;
};
export type FieldStoreWithOnChange = WritableAtom<any> & OnChange;
