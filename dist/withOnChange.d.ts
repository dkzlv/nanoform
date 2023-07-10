import { WritableAtom } from "nanostores";
import { FormStoreWithOnChange } from "./types";
export declare function withOnChange<T>(store: WritableAtom<T> & {
    getField: (...args: any[]) => any;
}): FormStoreWithOnChange<T>;
