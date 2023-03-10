import { WritableAtom } from "nanostores";
import { AllKeys, FromPath } from "./path";
declare type ListenFn<V> = (listener: (value: V, changedKey: undefined | AllKeys<V>) => void) => () => void;
declare type DeepMap<T> = {
    value: T;
    setKey: <K extends AllKeys<T>>(key: K, value: FromPath<T, K>) => void;
    listen: ListenFn<T>;
    subscribe: ListenFn<T>;
};
export declare type DeepMapStore<T> = Omit<WritableAtom<T>, keyof DeepMap<any>> & DeepMap<T>;
export declare function deepMap<T extends Record<string, unknown>>(initial: T): DeepMapStore<T>;
export {};
