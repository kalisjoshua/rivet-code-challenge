const formData = (form: HTMLFormElement) =>
  Object.fromEntries(new FormData(form));

export { formData };
