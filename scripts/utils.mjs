import { readdir, rm } from "fs/promises";
import { extname, join } from "node:path";

export async function getFilesWithExtensions(directory, extensions, filter) {
  const files = [];

  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(
        ...(await getFilesWithExtensions(fullPath, extensions, filter))
      );
    } else if (entry.isFile()) {
      const fileExtension = extname(entry.name);
      if (extensions.includes(fileExtension)) {
        if (typeof filter !== "function" || filter(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  }

  return files;
}

export async function rmFilesWithExtensions(directory, extensions) {
  const files = await getFilesWithExtensions(directory, extensions);

  for (let file of files) {
    await rm(file);
  }
}
