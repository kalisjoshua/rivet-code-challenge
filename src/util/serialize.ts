function serialize(obj: { [key: string]: unknown }) {
  return JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((acc, prop) => ({ ...acc, [prop]: obj[prop] }), {})
  );
}

export { serialize };
