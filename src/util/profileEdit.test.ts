import { ReducerResult, UpdatePayload, updateReducer } from "./profileEdit";

describe("updateReducer", () => {
  if (!global.structuredClone) {
    global.structuredClone = (obj: Object) => JSON.parse(JSON.stringify(obj));
  }

  test("no validation", () => {
    const initial: ReducerResult = { data: {} };
    const payload: UpdatePayload = { name: "test", value: "foo" };
    const result = updateReducer(initial, payload);

    expect(result).toEqual({
      data: {
        [payload.name]: payload.value,
      },
      errors: {
        [payload.name]: {
          maxLength: false,
          pattern: false,
          required: false,
        },
      },
    });
  });

  test("override", () => {
    const initial: ReducerResult = { data: {} };
    const override = { first_name: "Josh" };
    const payload: UpdatePayload = {
      name: "",
      override,
      value: "",
    };
    const result = updateReducer(initial, payload);

    expect(result).toEqual({
      data: {
        ...override,
      },
      errors: {},
    });
  });

  test("validate maxLength", () => {
    const initial: ReducerResult = { data: {} };
    const payload: UpdatePayload = { maxLength: 2, name: "test", value: "foo" };
    const result = updateReducer(initial, payload);

    expect(result).toEqual({
      data: {
        [payload.name]: payload.value,
      },
      errors: {
        [payload.name]: {
          maxLength: true,
          pattern: false,
          required: false,
        },
      },
    });
  });

  test("validate pattern", () => {
    const initial: ReducerResult = { data: {} };
    const payload: UpdatePayload = {
      name: "test",
      pattern: "^\\d\\d$",
      value: "foo",
    };
    const result = updateReducer(initial, payload);

    expect(result).toEqual({
      data: {
        [payload.name]: payload.value,
      },
      errors: {
        [payload.name]: {
          maxLength: false,
          pattern: true,
          required: false,
        },
      },
    });
  });

  test("validate required", () => {
    const initial: ReducerResult = { data: {} };
    const payload: UpdatePayload = { name: "test", required: true, value: "" };
    const result = updateReducer(initial, payload);

    expect(result).toEqual({
      data: {
        [payload.name]: payload.value,
      },
      errors: {
        [payload.name]: {
          maxLength: false,
          pattern: false,
          required: true,
        },
      },
    });
  });
});
