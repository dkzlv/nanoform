import type { Call, Objects } from "hotscript";

export type AllKeys<T> = Call<Objects.AllPaths, T>;
export type FromPath<T, K extends string> = Call<Objects.Get<K>, T>;
type Base = Record<string, unknown>;

/**
 * Get a deep value by key. Undefined if key is missing.
 * Doesn't have a lot of runtime sanity checks, instead relies on TS to tell the user about
 * their mistakes.
 *
 * @param obj Any object you want to get a deep path of
 * @param path Path splitted by dots. Arrays accessed the same as in JS: props.arr[1].nested
 */
export const getPath = <T extends Base, K extends AllKeys<T>>(
  obj: T,
  path: K
): FromPath<T, K> => {
  const allKeys = getAllKeysFromPath(path);

  let res: any = obj;
  for (const key of allKeys) {
    if (res === void 0) break;
    res = res[key];
  }
  return res;
};

/**
 * Set a deep value by key.
 * Does little runtime checks. Arrays are initialized with `undefiend` as their missing value
 * (same as `Array(n)`)
 *
 * @param obj Any object
 * @param path Path splitted by dots. Arrays accessed like in JS: props.arr[1].nested
 */
export function setPath<T extends Base, K extends AllKeys<T>>(
  obj: T,
  path: K,
  value?: FromPath<T, K>
): T {
  return setByKey(obj ?? {}, getAllKeysFromPath(path), value) as T;
}

/**
 * When it mutates anything, it also changes reference to the entity via `structuredClone`.
 * In other cases it returns reference to the same object.
 */
function setByKey(obj: Base, splittedKeys: string[], value: any) {
  let key = splittedKeys[0];
  ensureKey(obj, key, splittedKeys[1]);

  let copy = (Array.isArray(obj) ? [...obj] : { ...obj }) as Base;

  if (splittedKeys.length === 1) {
    if (value === undefined) {
      if (Array.isArray(obj)) {
        (copy as unknown as unknown[]).splice(key as unknown as number, 1);
      } else {
        delete copy[key];
      }
    } else copy[key] = value;
    return copy;
  }
  const newVal = setByKey(obj[key] as Base, splittedKeys.slice(1), value);
  obj[key] = newVal;
  return obj;
}

const arrayIndexFinderRegex = /(.*)\[(\d+)\]/;
function getAllKeysFromPath(path: string) {
  return path.split(".").flatMap((key) => {
    if (arrayIndexFinderRegex.test(key)) {
      let res = key.match(arrayIndexFinderRegex);
      return res!.slice(1);
    }
    return [key];
  });
}
function ensureKey(obj: Base, key: string, nextKey?: string) {
  if (key in obj) {
    return;
  }
  let nextKeyAsInt = parseInt(
    nextKey !== null && nextKey !== undefined ? nextKey : ""
  );
  if (Number.isNaN(nextKeyAsInt)) {
    obj[key] = {};
  } else {
    obj[key] = Array(nextKeyAsInt + 1).fill(undefined);
  }
}
