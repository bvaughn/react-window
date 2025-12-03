export function formatDescriptionText(text: string) {
  return text
    .replaceAll("\n- ", "<br/>• ")
    .replaceAll("\n\n", "<br/><br/>")
    .replaceAll(/~~([^~]+)~~/g, "<strike>$1</strike>")
    .replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replaceAll(/\*([^*]+)\*/g, "<em>$1</em>")
    .replaceAll(/_([^_]+)_/g, "<em>$1</em>")
    .replaceAll(/`([^`]+)`/g, "<code>$1</code>");
}
