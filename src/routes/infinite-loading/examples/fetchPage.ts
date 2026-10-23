import json from "../../../../public/data/contacts.json";

export type Contact = (typeof json)[0];

// Simulates loading a page of items from a server
export function fetchPage(page: number, pageSize: number): Promise<Contact[]> {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(json.slice(page * pageSize, (page + 1) * pageSize)),
      page === 0 ? 500 : 1000
    )
  );
}
