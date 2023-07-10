import { StoreValue, WritableAtom } from "nanostores";
export declare function withOnSubmit<T extends WritableAtom>(store: T, callback: (formData: StoreValue<T>, e?: any) => Promise<any>): T & {
    onSubmit: (e?: any) => Promise<void>;
};
