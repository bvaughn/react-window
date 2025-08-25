import { useEffect, useState } from "react";

export function useJSONData<Type extends object>(url: string) {
  const [json, setJSON] = useState<Type | undefined>();
  const [error, setError] = useState<unknown>(null);

  if (error) {
    throw error;
  }

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const data = await fetch(url, {
          signal: abortController.signal
        });
        if (!abortController.signal.aborted) {
          const json = await data.json();
          if (!abortController.signal.aborted) {
            setJSON(json as Type);
          }
        }
      } catch (error) {
        if (error instanceof Error && error?.name === "AbortError") {
          return;
        }

        console.error("Error thrown for URL: %o\n\n%o", url, error);

        setError(error);
      }
    })();

    return () => {
      const error = new Error();
      error.name = "AbortError";

      abortController.abort(error);
    };
  }, [url]);

  return json;
}
