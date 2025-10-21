import { marked } from "marked";
import type { PropItem } from "react-docgen-typescript";
import { getPropTypeText } from "./getPropTypeText.ts";

const TABLE_TAG_START = `
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>`;

const PROP_ROW = `
    <tr>
      <td>[[name]]</td>
      <td>[[description]]</td>
    </tr>`;

const TABLE_TAG_STOP = `
  </tbody>
</table>
`;

export async function propsToTable(props: PropItem[]) {
  const htmlStrings = [TABLE_TAG_START];

  for (const prop of props) {
    const type = getPropTypeText(prop);

    const description = await marked(prop.description);

    htmlStrings.push(
      PROP_ROW.replace("[[name]]", prop.name)
        .replace("[[type]]", type)
        .replace("[[description]]", description)
    );
  }

  htmlStrings.push(TABLE_TAG_STOP);

  return htmlStrings.join("");
}
