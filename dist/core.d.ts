import { type BaseDeepMap } from "nanostores";
import type { FormStore } from "./types";
export declare const nanoform: <T extends BaseDeepMap>(initial: T) => FormStore<T>;
