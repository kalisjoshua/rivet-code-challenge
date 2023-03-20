import { SDK } from "./naiveSDK";

import { mockFormForTesting } from "./mockFormForTesting";
import { formSubmitFactory } from "./profileSubmit";

describe("Profile Submit", () => {
  const [event, input] = mockFormForTesting();

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
