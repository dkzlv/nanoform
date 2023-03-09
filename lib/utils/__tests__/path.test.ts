import { getPath, setPath } from "../path";

const exampleObj = {
  a: "123",
  b: { c: 123, d: [{ e: 123 }] },
};
test("path evaluates correct value", () => {
  expect(getPath(exampleObj, "a")).toBe("123");
  expect(getPath(exampleObj, "b.c")).toBe(123);
  expect(getPath(exampleObj, "b.d[0]")).toEqual({ e: 123 });
  expect(getPath(exampleObj, "b.d[0].e")).toEqual(123);

  expect(
    // @ts-expect-error non existant key here
    getPath(exampleObj, "abra.cadabra.booms")
  ).toBeUndefined();
});

describe("set path", () => {
  test("simple path setting", () => {
    type TestObj = {
      a: {
        b?: { c: string; d: { e: string }[] };
        e: number;
      };
      f: string;
    };
    let initial: TestObj = { a: { e: 123 }, f: "" };
    initial = setPath(initial, "f", "hey");
    initial = setPath(initial, "a.e", 0);

    expect(initial).toEqual({ a: { e: 0 }, f: "hey" });
  });

  test("creating objects", () => {
    type TestObj = { a?: { b?: { c?: { d: string } } } };
    const initial: TestObj = {};

    setPath(initial, "a.b.c.d", "val");
    expect(initial?.a?.b?.c?.d).toBe("val");
  });
  test("creating arrays", () => {
    type TestObj = { a?: string[] };
    const initial: TestObj = {};

    setPath(initial, "a[0]", "val");
    expect(initial).toEqual({ a: ["val"] });
    setPath(initial, "a[3]", "val3");
    expect(initial).toEqual({ a: ["val", void 0, void 0, "val3"] });
  });

  describe("identity", () => {
    test("array items mutation changes identity on the same level", () => {
      const arr1 = { a: 1 },
        arr2 = { a: 2 },
        d = [arr1, arr2],
        c = { d };
      const initial = { a: { b: { c } } };
      {
        const newInitial = setPath(initial, "a.b.c.d[1].a", 3);
        expect(newInitial.a.b.c.d).toBe(d);
        expect(newInitial.a.b.c.d[0]).toBe(d[0]);
        expect(newInitial.a.b.c.d[1]).not.toBe(arr2);
      }
      {
        const newInitial = setPath(initial, "a.b.c.d[1]", undefined);
        expect(newInitial.a.b.c.d).not.toBe(d);
        expect(newInitial.a.b.c.d).toEqual([arr1]);
      }
    });

    test("object items mutation changes identity on the same level", () => {
      const d = { e: 123 } as { e: number } | undefined,
        c = { d };
      const initial = { a: { b: { c } } };
      {
        const newInitial = setPath(initial, "a.b.c.d.e", 3);
        expect(newInitial.a.b.c).toBe(c);
        expect(newInitial.a.b.c.d).not.toBe(d);
      }
      {
        const newInitial = setPath(initial, "a.b.c.d");
        expect(newInitial.a.b.c).not.toBe(c);
      }
    });
  });
});
