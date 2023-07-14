import { nanoquery } from "@nanostores/query";
import { nanoform, withOnChange, formatDate, withOnSubmit } from "./main";
import { FieldStoreWithOnChange } from "./types";
import { useStore } from "@nanostores/react";

const [, createMutationStore] = nanoquery();

// WITH ON CHANGE
{
  const $form = withOnChange(
    nanoform<{ str?: string; dt?: Date; num?: number; agreed?: boolean }>({})
  );

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
}

const Input = ({
  $field,
  type,
}: {
  $field: FieldStoreWithOnChange;
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

// WITH ON SUBMIT
{
  type AuthData = { email?: string; password?: string; agreed?: boolean };

  const $signup = createMutationStore<AuthData>(async ({ data }) => {
    // I'll leave this to reader's imagination
  });

  const $form = withOnSubmit(
    withOnChange(nanoform<AuthData>({})),
    $signup.mutate
  );

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
}
