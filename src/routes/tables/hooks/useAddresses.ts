import { useMemo } from "react";
import type json from "../../../../public/data/addresses.json";
import { useJSONData } from "../../../hooks/useJSONData";

type Address = (typeof json)[0];

export function useAddresses(): Address[] {
  const json = useJSONData<Address[]>("/data/addresses.json");

  return useMemo(() => {
    if (json) {
      return json.sort((a, b) => a.city.localeCompare(b.city));
    }

    return [];
  }, [json]);
}
