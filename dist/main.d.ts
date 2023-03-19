import { DeepMapStore } from "./utils/deepMap";
import { AllKeys, FromPath } from "./utils/path";
export declare type FieldStore<T> = DeepMapStore<T>;
export declare type FormStore<T> = DeepMapStore<T> & {
    getField: <K extends AllKeys<T>>(key: K) => FieldStore<FromPath<T, K>>;
};
export declare const nanoform: <T extends Record<string, unknown>>(initial: T) => FormStore<T>;
export { setPath, getPath } from "./utils/path";
export { deepMap } from "./utils/deepMap";
