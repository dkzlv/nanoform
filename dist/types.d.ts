import type { DeepMapStore, AllPaths, FromPath, BaseDeepMap, WritableAtom } from "nanostores";
export declare type FieldStore<T, K> = FromPath<T, K> extends BaseDeepMap ? DeepMapStore<FromPath<T, K>> : WritableAtom<FromPath<T, K>>;
export declare type FormStore<T extends BaseDeepMap> = DeepMapStore<T> & {
    getField: <K extends AllPaths<T>>(key: K) => FieldStore<T, K>;
};
export declare type FormStoreWithOnChange<T extends FormStore<any>> = T & {
    getField: <K extends AllPaths<T>>(key: K) => T["getField"] & {
        onChange: (e: any) => void;
    };
};
