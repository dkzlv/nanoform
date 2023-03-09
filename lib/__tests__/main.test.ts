import { nanoform } from "../main";

const createStore = () =>
  nanoform<{
    a: { b: string }[];
    c?: { d: { e: number } };
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
    expect(eEvents).toEqual([123, 321, 321]);
  });
});

const noop = () => {};
