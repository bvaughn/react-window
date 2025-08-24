import { useMemo } from "react";
import type json from "../../../../public/data/addresses.json";
import { useJSONData } from "../../../hooks/useJSONData";

type Address = (typeof json)[0];

type Item =
  | { type: "state"; state: string }
  | { type: "zip"; city: string; zip: string };

export function useCitiesByState(): Item[] {
  const json = useJSONData<Address[]>("/data/addresses.json");

  return useMemo(() => {
    const items: Item[] = [];

    if (json) {
      let currentState: string = "";

      json
        .sort((a, b) => {
          if (a.state !== b.state) {
            return a.state.localeCompare(b.state);
          } else if (a.city !== b.city) {
            return a.city.localeCompare(b.city);
          } else {
            return a.zip.localeCompare(b.zip);
          }
        })
        .forEach((address) => {
          if (address.state !== currentState) {
            currentState = address.state;

            items.push({
              type: "state",
              state: address.state
            });
          }

          items.push({
            type: "zip",
            city: address.city,
            zip: address.zip
          });
        });
    }

    return items;
  }, [json]);
}
