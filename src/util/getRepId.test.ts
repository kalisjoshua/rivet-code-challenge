import { getRepId } from "./getRepId";

describe("getRepId", () => {
  const originalLocation = window.location;

  Object.defineProperty(window, "location", {
    configurable: true,
    enumerable: true,
    value: { search: "" },
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: originalLocation,
    });
  });

  test("no search", () => {
    window.location.search = "";

    expect(getRepId()).toBe("");
  });

  test("no values", () => {
    window.location.search = "?";

    expect(getRepId()).toBe("");
  });

  test("id with no value", () => {
    window.location.search = "?id=";

    expect(getRepId()).toBe("");

    window.location.search = "?id";

    expect(getRepId()).toBe("");
  });

  test("id set in querystring", () => {
    const id = "hello";

    window.location.search = `?id=${id}`;

    expect(getRepId()).toBe(id);
  });
});
