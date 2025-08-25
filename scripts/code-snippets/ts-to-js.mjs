import prettier from "prettier";
import tsBlankSpace from "ts-blank-space";

export async function toToJs(source) {
  source = tsBlankSpace(source);
  source = source.replace(/<Grid<[^>]+>/g, "<Grid");
  source = source.replace(/<List<[^>]+>/g, "<List");
  source = source.replace(/ satisfies [a-zA-Z]+/g, "");

  return await prettier.format(source, {
    parser: "babel"
  });
}
