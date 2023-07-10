import { nanoform } from "../core";
import { withOnChange } from "../withOnChange";
import { render, fireEvent, screen } from "@testing-library/react";

test("handles non-empty events", () => {
  const form = withOnChange(
    nanoform({
      text: "",
      number: 0,
      checkbox: false,
      date: new Date("2020-01-01"),
    })
  );
  form.subscribe(() => {});
  const text = form.getField("text"),
    number = form.getField("number"),
    checkbox = form.getField("checkbox"),
    date = form.getField("date");

  [text, number, checkbox, date].forEach((field) => field.listen(() => {}));

  const toRender = (
    <>
      <input data-testid="text" type="text" onChange={text.onChange} />
      <input data-testid="num" type="number" onChange={number.onChange} />
      <input data-testid="check" type="checkbox" onChange={checkbox.onChange} />
      <input data-testid="dt" type="date" onChange={date.onChange} />
    </>
  );

  render(toRender);

  fireEvent.change(screen.getByTestId("text"), {
    target: { value: "hello" },
  });
  fireEvent.change(screen.getByTestId("num"), {
    target: { value: "42" },
  });
  fireEvent.click(screen.getByTestId("check"));
  fireEvent.change(screen.getByTestId("dt"), {
    target: { value: "2022-01-01" },
  });

  expect(form.get()).toEqual({
    text: "hello",
    number: 42,
    checkbox: true,
    date: new Date("2022-01-01"),
  });
});
