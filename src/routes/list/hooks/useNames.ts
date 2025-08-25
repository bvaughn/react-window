import { useJSONData } from "../../../hooks/useJSONData";
import type json from "../../../../public/data/names.json";
import { EMPTY_ARRAY } from "../../../constants";

type Name = (typeof json)[0];

export function useNames(): Name[] {
  return useJSONData<Name[]>("/data/names.json") ?? (EMPTY_ARRAY as Name[]);
}
