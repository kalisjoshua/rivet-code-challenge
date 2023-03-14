/**
 * @name getRepId
 *
 * @description
 * Reusable function for consistently extracting the current id from the URL.
 */
function getRepId(): string {
  const params = window.location.search
    .replace(/^\?/, "")
    .split("&")
    .reduce((acc, pair) => {
      const [key, value] = pair.split(/\s*=\s*/);

      acc[key] = value;

      return acc;
    }, {} as { [key: string]: string });

  return params?.id || "";
}

export { getRepId };
