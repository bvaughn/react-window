import { useJSONData } from "../../../hooks/useJSONData";
import type json from "../../../../public/data/lorem.json";
import { EMPTY_ARRAY } from "../../../constants";

type Lorem = (typeof json)[0];

export function useLorem(): Lorem[] {
  return useJSONData<Lorem[]>("/data/lorem.json") ?? (EMPTY_ARRAY as Lorem[]);
}
