import { nanoform } from "../main";
import { render, fireEvent, screen } from "@testing-library/react";
import { nanoquery } from "@nanostores/query";

test("handles submit event", async () => {
  const createMutation = nanoquery()[1];

  const mutateFn = vi.fn().mockImplementation(delay);
  const $mutate = createMutation<unknown>(mutateFn);

  const initialValue = {
    text: "",
    number: 0,
    checkbox: false,
    date: new Date("2020-01-01"),
  };

  const form = nanoform(initialValue, $mutate.mutate);
  form.subscribe(() => {});

  const toRender = (
    <form onSubmit={form.onSubmit}>
      <button data-testid="go" type="submit">
        go
      </button>
    </form>
  );
  render(toRender);

  for (let i = 0; i < 10; i++) {
    fireEvent.click(screen.getByTestId("go"));
  }

  expect($mutate.get().loading).toBe(true);
  expect(mutateFn).toHaveBeenCalledTimes(1);
  expect(mutateFn.mock.calls?.[0][0].data).toBe(initialValue);

  await delay(200);
  expect($mutate.get().loading).toBe(false);
});

test("handles sync callback", async () => {
  const mutateFn = vi.fn();
  const form = nanoform({}, mutateFn);
  form.subscribe(() => {});
  form.onSubmit();
});

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));
