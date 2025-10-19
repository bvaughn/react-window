export function formatDescriptionText(text: string) {
  return text
    .replaceAll("\n- ", "<br/>• ")
    .replaceAll("\n\n", "<br/><br/>")
    .replaceAll(/`([^`]+)`/g, "<code>$1</code>");
}
