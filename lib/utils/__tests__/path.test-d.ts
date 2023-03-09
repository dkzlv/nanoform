import { getPath, setPath } from "../path";

const exampleObj = {
  a: "123",
  b: { c: 123, d: [{ e: 123 }] },
};
test(`get: correct key types and resulting e`, () => {
  expectTypeOf(getPath(exampleObj, "a")).toEqualTypeOf<string>();
  expectTypeOf(getPath(exampleObj, "b.c")).toEqualTypeOf<number>();
  expectTypeOf(getPath(exampleObj, "b.d")).toEqualTypeOf<{ e: number }[]>();
  expectTypeOf(getPath(exampleObj, "b.d[0]")).toEqualTypeOf<{
    e: number;
  }>();
  expectTypeOf(getPath(exampleObj, "b.d[0].e")).toEqualTypeOf<number>();
  const check = getPath(exampleObj, "b.d[0].e");
  //    ^?

  // @ts-expect-error: non-existing key
  getPath(exampleObj, "hey");
});

test(`set: typings`, () => {
  setPath(exampleObj, "b.c", 321);

  // @ts-expect-error: incorrect types
  setPath(exampleObj, "b.c", "");
});
