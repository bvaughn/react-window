import { useMemo } from "react";
import json from "../../../../public/data/addresses.json";

type Address = (typeof json)[0];

export function useAddresses(): Address[] {
  return useMemo(() => {
    if (json) {
      return json.sort((a, b) => a.city.localeCompare(b.city));
    }

    return [];
  }, []);
}
