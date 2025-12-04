export function insertPropsMarkdown({
  componentMarkdown,
  componentName,
  markdown,
  required
}: {
  componentMarkdown: string;
  componentName: string;
  markdown: string;
  required: boolean;
}) {
  const flag = `${componentName}:${required ? "required" : "optional"}`;
  const startToken = `<!-- ${flag}:begin -->`;
  const stopToken = `<!-- ${flag}:end -->`;

  const startIndex = markdown.indexOf(startToken) + startToken.length;
  const stopIndex = markdown.indexOf(stopToken);

  return (
    markdown.substring(0, startIndex) +
    "\n" +
    componentMarkdown +
    "\n" +
    markdown.substring(stopIndex)
  );
}
