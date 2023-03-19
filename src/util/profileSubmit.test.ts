import { SDK } from "./naiveSDK";

import { formSubmitFactory } from "./profileSubmit";
import { formData } from "./formData";

jest.mock("./formData", () => ({
  formData: jest.fn(),
}));

describe("Profile Submit", () => {
  const formMock = {
    repId: {
      removeAttribute: jest.fn(),
      setAttribute: jest.fn(),
      testValue: () => "test",
    },
  } as unknown as HTMLFormElement;
  const updateMock = jest.fn();

  beforeEach(() => {
    formMock.repId.removeAttribute.mockReset();
    formMock.repId.setAttribute.mockReset();
    updateMock.mockReset();
  });

  test("add rep", async () => {
    const clientMock = {
      POST: jest.fn(() => Promise.resolve()),
      PUT: jest.fn(() => Promise.resolve()),
    } as unknown as SDK;

    (formData as jest.Mock).mockReturnValue({
      other: "stuff",
      repId: "",
    });

    const handler = formSubmitFactory(clientMock, updateMock);

    const result = handler({
      currentTarget: formMock,
      preventDefault: jest.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>);

    await expect(result).resolves.toBeUndefined();

    expect((clientMock.POST as jest.Mock).mock.calls.length).toBe(1);
  });

  test("update rep", async () => {
    const clientMock = {
      POST: jest.fn(() => Promise.resolve()),
      PUT: jest.fn(() => Promise.resolve()),
    } as unknown as SDK;

    (formData as jest.Mock).mockReturnValue({
      other: "stuff",
      repId: "9",
    });

    const handler = formSubmitFactory(clientMock, updateMock);

    const result = handler({
      currentTarget: formMock,
      preventDefault: jest.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>);

    await expect(result).resolves.toBeUndefined();

    expect((clientMock.PUT as jest.Mock).mock.calls.length).toBe(1);
  });
});
