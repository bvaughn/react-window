import { rm } from "fs/promises";
import { getFilesWithExtensions } from "./getFilesWithExtensions.ts";

export async function rmFilesWithExtensions(
  directory: string,
  extensions: string[]
) {
  const files = await getFilesWithExtensions(directory, extensions);

  for (const file of files) {
    await rm(file);
  }
}
