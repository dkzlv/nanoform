export function withOnChange(store: any): any {
  const orig = store.getField;
  store.getField = (key: string) => {
    const field = orig(key);
    field.onChange = (e: any) => {
      const target = e?.currentTarget;
      if (!target) return;

      let value;
      switch (target.type) {
        case "date":
        case "month":
        case "week":
          value = target.valueAsDate;
          break;
        case "number":
        case "range":
          value = target.valueAsNumber;
          break;
        case "checkbox":
          value = target.checked;
          break;
        default:
          // Covers select, select multiple, textarea, text, email, password, search, tel, url
          // datetime-local, time, color, hidden, radio
          value = target.value;
      }
      field.set(value);
    };
    return field;
  };
  return store;
}
