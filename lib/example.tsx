import { nanoquery } from "@nanostores/query";
import { nanoform, formatDate } from "./main";
import { useStore } from "@nanostores/react";
import { FieldStore } from "./types";

const [, createMutationStore] = nanoquery();

type Form = {
  str?: string;
  dt?: Date;
  num?: number;
  agreed?: boolean;
};

// WITH ON CHANGE
{
  const $form = nanoform<Form>({});

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
  $field: FieldStore<Form, any>;
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

  const $form = nanoform<AuthData>({}, $signup.get().mutate);

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
