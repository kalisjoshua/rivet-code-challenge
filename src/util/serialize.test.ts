import { serialize } from "./serialize";

test("serialize", () => {
  const a = { foo: 1, bar: 2, baz: 3 };
  const b = { baz: 3, foo: 1, bar: 2 };

  expect(serialize(a)).toMatch(serialize(b));
});
