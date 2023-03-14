import { clientFactory } from "./naiveSDK";

const ROOT = "https://example.tld";
const TOKEN = "abs123";

const defaultResponse: Response = {
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  // blob: "",
  body: "" as unknown as ReadableStream<Uint8Array>,
  bodyUsed: true,
  clone: () => new Response(),
  formData: () => Promise.resolve(new FormData()),
  headers: {} as Headers,
  // json: "",
  ok: true,
  redirected: false,
  status: 200,
  statusText: "",
  text: () => Promise.resolve(""),
  type: "basic",
  url: "",
} as Response;

describe("naiveSDK clientFactory", () => {
  const client = clientFactory(ROOT, TOKEN);

  test("GET request", async () => {
    const resource = "/resource";
    const mockedFetch = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ...defaultResponse,
        json: () => Promise.resolve([]),
        status: 200,
      })
    );

    await client.GET(resource);

    expect.assertions(1);
    expect(mockedFetch).toHaveBeenCalledWith(`${ROOT}${resource}`, {
      headers: { token: TOKEN },
      method: "GET",
    });
  });

  test("error response from API", async () => {
    const resource = "/resource";

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ...defaultResponse,
        json: () => Promise.resolve([]),
        status: 400,
        statusText: "testing error",
        url: `${ROOT}${resource}`,
      })
    );

    expect.assertions(1);
    await expect(client.GET(resource)).rejects.toEqual(
      new Error(`400 testing error (basic) - ${ROOT}${resource}`)
    );
  });
});
