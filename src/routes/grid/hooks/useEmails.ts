import { useMemo } from "react";
import json from "../../../../public/data/contacts.json";

export function useEmails(): string[] {
  return useMemo(() => {
    if (json) {
      return json
        .map((contact) => contact.email)
        .sort((a, b) => a.localeCompare(b));
    }

    return [];
  }, []);
}
