import { useMemo } from "react";
import json from "../../../../public/data/contacts.json";

type Contact = (typeof json)[0];

export function useContacts(): Contact[] {
  return useMemo(() => {
    if (json) {
      return json.sort((a, b) => {
        if (a.title !== b.title) {
          return a.title.localeCompare(b.title);
        } else if (a.first_name !== b.first_name) {
          return a.first_name.localeCompare(b.first_name);
        } else {
          return a.last_name.localeCompare(b.last_name);
        }
      });
    }

    return [];
  }, []);
}
