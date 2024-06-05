# Nano Stores Form

<img align="right" width="92" height="92" title="Nano Stores logo"
     src="https://nanostores.github.io/nanostores/logo.svg">

A tiny form library for [Nano Stores](https://github.com/nanostores/nanostores).

- **Small**. The core is only 350 bytes.
- **Phenomenal performance**. Only rerenders those fields that got updates.
- **Nano Stores first**. Finally, have your form logic *outside* of components. 
Plays nicely with [store events](https://github.com/nanostores/nanostores#store-events),
[computed stores](https://github.com/nanostores/nanostores#computed-stores),
[remote queries](https://github.com/nanostores/query), and the rest.
- **UI agnostic**. Use native `<form>`, any UI kit, React Native, or any mix of them.
- **Unbeatable TS support**. Very strict typing of nested fields, so you don't
waste time debugging.

<a href="https://evilmartians.com/?utm_source=nanostores-query">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Install

```sh
npm install nanostores @nanostores/form
```

## Usage

See [Nano Stores docs](https://github.com/nanostores/nanostores#guide) about using the store and subscribing to store’s changes in UI frameworks.

Nanoform gives you a couple of helpers. Let's go one by one.

### `nanoform` that returns `FormStore`

The core is the form store and its initial shape. `nanoform` returns a [`deepMap`](https://github.com/nanostores/nanostores#deep-maps) from the Nano Stores standard exports.

```tsx
import { nanoform } from '@nanostores/form';

export const $authForm = nanoform<{email1?: string, email2?: string, password?: string}>({});

const AuthForm = () => {
  const { email1, email2, password } = useStore($authForm);

  return (
    <>
      <input
        type="email"
        value={email1}
        onChange={e => $authForm.setKey('email1', e.currentTarget.value)} />
        {/* render email2, password */}
    </>
  );
};
```

Here you go. You can already use this store in the UI. But it has a few issues:

1. it will rerender the whole form like crazy on each keystroke! Sometimes it's fine, but most of the time it's not.
2. also, it'd be good to have some decent validation of the `email1` and `email2` equality.

We'll tackle them one by one.

## `FormStore.getField` that returns `FieldStore`

Here comes the core helper: `.getField`. It's a strictly typed function which gets the object path to the field and returns a _stable_ store for this field. Stable means that it won't change its identity if you call this function many times with the same key.

The return is just another `deepMap`, so it works with everything Nano Stores provides you with (lifecycles, `computed`, etc.).

The most magical part is that its value is in two-way sync with the parent form, so whenever any of them changes, the other changes as well.

Let's add a simple check if emails are the same.

```tsx
import { computed } from 'nanostores';
import { useStore } from '@nanostores/react';

// Will only recalc when these two fields change
// You can use the same approach to run schema validation on the whole form data
// or just a subtree of it.
const $emailsAreSame = computed(
  [$authForm.getField("email1"), $authForm.getField("email2")],
  (email1, email2) => email1 === email2
);

// Will only rerender when this field is touched
const Email1 = () => {
  const $field = $authForm.getField("email1");
  return (
    <input
      type="email"
      value={useStore($field)}
      onChange={(e) => $field.set(e.currentTarget.value)}
    />
  );
};
```

## `FormStore.onSubmit`

When you create a form store, you can provide a second optional argument for the form submission method.

```tsx
import { nanoform } from '@nanostores/form';
import { useStore } from '@nanostores/react';

export const $simpleForm = nanoform<{field1?: string}>(
  {},
  async (data) => {
    // sending data somewhere, validation, etc.
  }
);

const Form = () => {
  return (
    <form onSubmit={$simpleForm.onSubmit}>
      ...
    </form>
  );
};
```

It's essentially a small quality-of-life improvement. It:

1. no double submissions can happen (we await for the submit function to resolve);
2. we call `preventDefault`;
3. we reset form's value to initial upon successful submission.

## `FieldStore.onChange`

All of the `FieldStore` instances have a `onChange` function on them. 

This is the second most important helper. Just wrap your form with this function to get a stable identity `onChange` callback added to your fields:

```tsx
import { nanoform, formatDate, type FieldStore } from "@nanostores/form";
import { useStore } from "@nanostores/react";

const $form = nanoform<{ str?: string; dt?: Date; num?: number; agreed?: boolean }>({});

const App = () => {
  return (
    <>
      <Input type="text" $field={$form.getField("str")} />
      <Input type="date" $field={$form.getField("dt")} />
      <Input type="number" $field={$form.getField("num")} />
      <Input type="checkbox" $field={$form.getField("num")} />
    </>
  );
};

const Input = ({
  $field,
  type,
}: {
  $field: FieldStore;
  type: JSX.IntrinsicElements["input"]["type"];
}) => {
  const value = useStore($field);
  return (
    <input
      type={type}
      value={type === "date" ? formatDate(value as Date) : value}
      onChange={$field.onChange}
    />
  );
};
```

The neat thing is that it will use `value`, `valueAsNumber`, `valueAsDate` and `checked` based on the type this input has. So you'll get the value casted to the correct type completely automatically by the browser.

## `FormStore.reset` and `FieldStore.reset`

When creating the form, we make a `structuredClone` of the initial provided value.

Call `form.reset()` to reset the form to its initial value, call `field.reset()` to reset this specific field.

## Recipes

### Usage with `@nanostores/query`

Form submission plays really nice with [`@nanostores/query` mutations](https://github.com/nanostores/query#createmutatorstore). Just provide the `mutate` function directly to the form call.

```tsx
type AuthData = { email?: string; password?: string; agreed?: boolean };

const $signup = createMutationStore<AuthData>(async ({ data }) => {
  // I'll leave this to reader's imagination
});

const $form = nanoform<AuthData>({}, $signup.mutate);

const Signup = () => {
  const { loading, error } = useStore($signup);

  return (
    <form onSubmit={$form.onSubmit}>
      <Input type="email" $field={$form.getField("email")} />
      <Input type="date" $field={$form.getField("password")} />
      <Input type="checkbox" $field={$form.getField("agreed")} />

      <button disabled={loading}>Sign up</button>
      {error && <p>Something terrible happened</p>}
    </form>
  );
};
```
