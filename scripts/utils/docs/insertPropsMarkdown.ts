export function insertPropsMarkdown({
  componentMarkdown,
  componentName,
  markdown,
  section
}: {
  componentMarkdown: string;
  componentName: string;
  markdown: string;
  section: string;
}) {
  const flag = `${componentName}:${section}`;
  const startToken = `<!-- ${flag}:begin -->`;
  const stopToken = `<!-- ${flag}:end -->`;

  const startIndex = markdown.indexOf(startToken) + startToken.length;
  const stopIndex = markdown.indexOf(stopToken);
  if (startIndex < 0 || stopIndex < 0) {
    throw Error("Parsing README failed");
  }

  return (
    markdown.substring(0, startIndex) +
    "\n" +
    (componentMarkdown || "None") +
    "\n" +
    markdown.substring(stopIndex)
  );
}
