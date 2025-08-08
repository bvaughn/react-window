import { mkdir, readdir, writeFile } from "fs/promises";
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { cwd } from "node:process";
import { withCustomConfig } from "react-docgen-typescript";

const parser = withCustomConfig("./tsconfig.json", {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true,
});

async function main() {
  const libDir = join(cwd(), "lib", "components");
  const files = await getFilesWithExtensions(libDir, [".ts", ".tsx"]);

  const docsDir = join(cwd(), "docs");
  try {
    await stat(docsDir);
  } catch {
    mkdir(docsDir);
  }

  for (let file of files) {
    console.debug("Parsing %o", file);

    const components = parser.parse(file);
    for (let component of components) {
      const filePath = join(docsDir, `${component.displayName}.json`);
      await writeFile(filePath, JSON.stringify(component, null, 2));
    }
  }
}

async function getFilesWithExtensions(directory, extensions, foundFiles = []) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      await getFilesWithExtensions(fullPath, extensions, foundFiles); // Recurse into subdirectories
    } else if (entry.isFile()) {
      const fileExtension = extname(entry.name);
      if (extensions.includes(fileExtension)) {
        foundFiles.push(fullPath); // Add file if its extension matches
      }
    }
  }
  return foundFiles;
}

main();
