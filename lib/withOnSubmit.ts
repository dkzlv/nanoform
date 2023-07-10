export function withOnSubmit(
  store: any,
  callback: (formData: any, e?: any) => Promise<any>
): any {
  let submitting = false;
  store.onSubmit = async (e?: any) => {
    e.preventDefault();

    if (submitting) return;
    submitting = true;
    callback(store.value, e).finally(() => (submitting = false));
  };
  return store;
}
