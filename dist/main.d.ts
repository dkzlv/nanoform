import { type BaseDeepMap } from "nanostores";
import type { FormStore, FieldStore } from "./types";
export { FormStore, FieldStore };
export declare const nanoform: <T extends BaseDeepMap>(initial: T, onSubmit?: ((data: T) => Promise<any> | any) | undefined) => FormStore<T>;
export declare function formatDate(d?: Date): string;
