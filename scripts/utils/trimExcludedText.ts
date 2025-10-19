export function trimExcludedText(rawText: string) {
  {
    const pieces = rawText.split("// <begin>");
    rawText = pieces[pieces.length - 1].trim();
  }

  {
    const pieces = rawText.split("// <end>");
    rawText = pieces[0].trim();
  }

  return rawText;
}
