type HTTP_VERBS =
  | "CONNECT"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "PATCH"
  | "POST"
  | "PUT"
  | "TRACE";
type Options = { headers?: {} };
type Method = <T>(
  resource: string,
  options?: Options,
  ignoreCache?: Boolean
) => Promise<T>;
type SDK = {
  [key in HTTP_VERBS]: Method;
};

/**
 * @name clientFactory
 *
 * @description
 * Creates an Object that provides ergonomics for performing fetch requests.
 * All HTTP methods/verbs are available as methods to call in calling code.
 * Responses are automatically cached in localStorage and cached values are
 * returned if available, saving http traffic.
 *
 * @example
 * ```
 * const client = clientFactory("https://api.example.com", "abc123");
 *
 * client.GET("/books").then((data) => console.log(data));
 * ```
 */
function clientFactory(root: string, token: string): SDK {
  return new Proxy(
    {},
    {
      get(_, method: HTTP_VERBS): Method {
        return (resource: string, options?: Options, ignoreCache = false) => {
          const URI = `${root}${resource}`;

          const init = {
            ...options,
            method: method.toUpperCase(),
            headers: {
              ...options?.headers,
              token,
            },
          };

          return fetch(URI, init).then((res) => {
            return res.status < 400
              ? res.json()
              : Promise.reject(
                  new Error(
                    `${res.status} ${res.statusText} (${res.type}) - ${res.url}`
                  )
                );
          });
        };
      },
    }
  ) as SDK;
}

export type { SDK };
export { clientFactory };
