import { useMemo } from "react";
import type json from "../../../../public/data/contacts.json";
import { useJSONData } from "../../../hooks/useJSONData";

type Contact = (typeof json)[0];

export function useContacts(): Contact[] {
  const json = useJSONData<Contact[]>("/data/contacts.json");

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
  }, [json]);
}
