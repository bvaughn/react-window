// Simulates loading a page of items from a server
export function fetchPage(page: number, pageSize: number): Promise<string[]> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          Array.from(
            { length: pageSize },
            (_, index) => `Item ${page * pageSize + index + 1}`
          )
        ),
      page === 0 ? 500 : 1000
    )
  );
}
