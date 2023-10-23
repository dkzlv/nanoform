import type {
  DeepMapStore,
  AllPaths,
  FromPath,
  BaseDeepMap,
  WritableAtom,
} from "nanostores";

export type FieldStore<T, K> = (FromPath<T, K> extends BaseDeepMap
  ? DeepMapStore<FromPath<T, K>>
  : WritableAtom<FromPath<T, K>>) & {
  onChange: (e: { currentTarget: unknown }) => void;
};
export type FormStore<T extends BaseDeepMap> = DeepMapStore<T> & {
  getField: <K extends AllPaths<T>>(key: K) => FieldStore<T, K>;
  onSubmit: (e?: any) => void;
};
