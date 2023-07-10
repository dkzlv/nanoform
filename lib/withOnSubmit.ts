import { StoreValue, WritableAtom } from "nanostores";

export function withOnSubmit<T extends WritableAtom>(
  store: T,
  callback: (formData: StoreValue<T>, e?: any) => Promise<any>
) {
  type Return = T & { onSubmit: (e?: any) => Promise<void> };

  let submitting = false;
  (store as Return).onSubmit = async (e?: any) => {
    e.preventDefault();

    if (submitting) return;
    submitting = true;
    callback(store.value, e).finally(() => (submitting = false));
  };
  return store as Return;
}
