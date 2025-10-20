import type { Props } from "react-docgen-typescript";
import { getPropTypeText } from "./getPropTypeText.ts";

const TABLE_TAG_START = `
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Required?</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>`;
const TABLE_ROW = `
    <tr>
      <td>[[name]]</td>
      <td>[[required]]</td>
      <td>
        <code>[[type]]</code>
      </td>
      <td>
[[description]]
      </td>
    </tr>`;

const TABLE_TAG_STOP = `
  </tbody>
</table>
`;

export function propsToTable(props: Props) {
  const htmlStrings = [TABLE_TAG_START];

  for (const propName in props) {
    const prop = props[propName];

    const type = getPropTypeText(prop);

    const description = prop.description
      .replace("\n\n", "<br/><br/>")
      .replace("\n", " ")
      .replace("<br/><br/>", "\n\n");

    htmlStrings.push(
      TABLE_ROW.replace("[[name]]", propName)
        .replace("[[required]]", prop.required ? "✓" : "")
        .replace("[[type]]", type)
        .replace("[[description]]", description)
    );
  }

  htmlStrings.push(TABLE_TAG_STOP);

  return htmlStrings.join("");
}
