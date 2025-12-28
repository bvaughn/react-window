import type { Contact } from "./Grid";

export const COLUMN_KEYS: (keyof Contact)[] = [
  "title",
  "first_name",
  "last_name",
  "email",
  "gender",
  "address",
  "city",
  "state",
  "zip",
  "timezone",
  "company",
  "job_title"
];

export function indexToColumn(columnIndex: number): keyof Contact {
  return COLUMN_KEYS[columnIndex];
}
