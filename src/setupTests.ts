// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

if (!global.structuredClone) {
  global.structuredClone = (obj: Object) => JSON.parse(JSON.stringify(obj));
}
