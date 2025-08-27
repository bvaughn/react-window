import type json from "../../../../public/data/arabic-countries.json";
import { EMPTY_ARRAY } from "../../../constants";
import { useJSONData } from "../../../hooks/useJSONData";

type Country = (typeof json)[0];

export function useArabicCountries(): Country[] {
  return (
    useJSONData<Country[]>("/data/arabic-countries.json") ??
    (EMPTY_ARRAY as Country[])
  );
}
