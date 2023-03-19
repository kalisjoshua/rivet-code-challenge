import { SDK } from "./naiveSDK";

import { formSubmitFactory } from "./profileSubmit";

function createElement(type: string, name: string, value = "") {
  const el = document.createElement(type);

  el.setAttribute("name", name);

  return el;
}

describe("Profile Submit", () => {
  const currentTarget = createElement("form", "profile") as HTMLFormElement;
  const event = {
    currentTarget,
    preventDefault: jest.fn(),
  } as unknown as React.SyntheticEvent<HTMLFormElement>;
  const input = createElement("input", "repId");

  currentTarget.appendChild(input);

  test("add rep", async () => {
    const clientMock = {
      POST: jest.fn(() => Promise.resolve()),
      PUT: jest.fn(() => Promise.resolve()),
    } as unknown as SDK;
    const handler = formSubmitFactory(clientMock, jest.fn());

    input.setAttribute("value", "");

    await expect(handler(event)).resolves.toBeUndefined();

    expect((clientMock.POST as jest.Mock).mock.calls.length).toBe(1);
    expect((clientMock.PUT as jest.Mock).mock.calls.length).toBe(0);
  });

  test("update rep", async () => {
    const clientMock = {
      POST: jest.fn(() => Promise.resolve()),
      PUT: jest.fn(() => Promise.resolve()),
    } as unknown as SDK;
    const handler = formSubmitFactory(clientMock, jest.fn());

    input.setAttribute("value", "9");

    await expect(handler(event)).resolves.toBeUndefined();

    expect((clientMock.POST as jest.Mock).mock.calls.length).toBe(0);
    expect((clientMock.PUT as jest.Mock).mock.calls.length).toBe(1);
  });
});
