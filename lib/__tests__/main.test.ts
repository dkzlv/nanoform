import { nanoform } from "../main";

const createStore = () =>
  nanoform<{
    a: { b: string }[];
    c?: { d: { e: number } };
    g?: string;
    h?: string;
  }>({
    a: [],
  });

describe("basic tests", () => {
  test("stable identity of field store", () => {
    const $form = createStore();
    expect($form.getField("c")).toBe($form.getField("c"));
  });

  test("two-way sync", () => {
    const $form = createStore();

    const formEvents: number[] = [];
    $form.listen((v) => formEvents.push(v.c?.d.e!));

    const e = $form.getField("c.d.e");
    const eEvents: number[] = [];
    e.listen((v) => eEvents.push(v!));

    $form.setKey("c.d.e", 123);
    expect($form.get().c?.d.e).toBe(123);
    expect(e.get()).toBe(123);

    e.set(321);
    expect($form.get().c?.d.e).toBe(321);
    expect(e.get()).toBe(321);

    expect(formEvents).toEqual([123, 321]);
    expect(eEvents).toEqual([123, 321]);
  });

  test("repeated subscriptions", () => {
    const $form = createStore();

    const formEvents: number[] = [];
    $form.listen((v) => formEvents.push(v.c?.d.e!));

    const e = $form.getField("c.d.e");
    e.get();
    e.get();
    e.get();
    e.get();
    $form.setKey("c.d.e", 123);
    e.get();
    e.get();
    expect(e.get()).toBe(123);
  });

  test("it only fires when a related field or the whole form changed", () => {
    const $form = createStore();

    const form: { h?: string; g?: string }[] = [];
    $form.listen((v) => form.push({ h: v.h, g: v.g }));

    const $h = $form.getField("h");
    const h: (string | undefined)[] = [];
    $h.listen((v) => h.push(v));

    const $g = $form.getField("g");
    const g: (string | undefined)[] = [];
    $g.listen((v) => g.push(v));

    $g.set("1");
    expect(g).toEqual(["1"]);
    expect(form).toEqual([{ g: "1", h: void 0 }]);
    expect(h).toEqual([]);

    $h.set("2");
    expect(h).toEqual(["2"]);
    expect(form).toEqual([
      { g: "1", h: void 0 },
      { g: "1", h: "2" },
    ]);
    expect(g).toEqual(["1"]);

    $form.setKey("g", "3");
    expect(h).toEqual(["2"]);
    expect(form).toEqual([
      { g: "1", h: void 0 },
      { g: "1", h: "2" },
      { g: "3", h: "2" },
    ]);
    expect(g).toEqual(["1", "3"]);

    $form.set({ a: [] });
    expect(h).toEqual(["2", void 0]);
    expect(form).toEqual([
      { g: "1", h: void 0 },
      { g: "1", h: "2" },
      { g: "3", h: "2" },
      { g: void 0, h: void 0 },
    ]);
    expect(g).toEqual(["1", "3", void 0]);
  });
});
