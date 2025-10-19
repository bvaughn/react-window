import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { getFilesWithExtensions } from "./getFilesWithExtensions.ts";
import { rmFilesWithExtensions } from "./rmFilesWithExtensions.ts";

export async function initialize({
  fileExtensions,
  fileFilter,
  inputPath,
  outputDirName
}: {
  fileExtensions: string[];
  fileFilter?: (path: string) => boolean;
  inputPath: string[];
  outputDirName: string;
}) {
  const inputDir = join(cwd(), ...inputPath);
  const outputDir = join(cwd(), "public", "generated", outputDirName);
  await mkdir(outputDir, { recursive: true });
  await rmFilesWithExtensions(outputDir, [".json"]);

  const files = await getFilesWithExtensions(
    inputDir,
    fileExtensions,
    fileFilter
  );

  return {
    files,
    inputDir,
    outputDir
  };
}
