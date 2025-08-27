import { useMemo } from "react";
import type json from "../../../../public/data/contacts.json";
import { useJSONData } from "../../../hooks/useJSONData";

type Contact = (typeof json)[0];

export function useEmails(): string[] {
  const json = useJSONData<Contact[]>("/data/contacts.json");

  return useMemo(() => {
    if (json) {
      return json
        .map((contact) => contact.email)
        .sort((a, b) => a.localeCompare(b));
    }

    return [];
  }, [json]);
}
