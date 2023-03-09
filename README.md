# Nano Stores Form

<img align="right" width="92" height="92" title="Nano Stores logo"
     src="https://nanostores.github.io/nanostores/logo.svg">

A tiny form library for [Nano Stores](https://github.com/nanostores/nanostores).

- **Small**. 730 bytes (minified and gzipped).
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

See [Nano Stores docs](https://github.com/nanostores/nanostores#guide)
about using the store and subscribing to store’s changes in UI frameworks.

### Form

At the core of nanoform is the form store and its initial shape.

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
        {/* ... */}
    </>
  );
};
```

Here you go. You can already use this store in the UI. But it has a few issues:

1. it will rerender the whole form like crazy on each of your keystroke! Sometimes
it's fine, but let's assume it's not good in our case.
2. also, it'd be good to have some decent validation of the `email1` and
`email2` equality.

Let's use the `$authForm.getField` helper, that gets the object path to the field
and returns a stable and store for this field. The store is just an `atom`, nothing
fancy. It means you can use all the foundational blocks of Nano Stores with them.

```ts
import { computed } from 'nanostores';

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
