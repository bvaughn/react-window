import { Block, Box, Code, Header } from "react-lib-tools";
import ImageRowMarkdown from "../../../public/generated/examples/ImageRow.json";
import ImagesMarkdown from "../../../public/generated/examples/Images.json";
import { Link } from "../../components/Link";
import { ExampleWithImages } from "./examples/Images";

export default function ImagesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Images" />
      <div>
        Images are example of{" "}
        <Link to="/list/dynamic-row-height">dynamic row heights</Link>.
      </div>
      <Block className="h-150 max-h-[50vh]" data-focus-within="bold">
        <ExampleWithImages />
      </Block>
      <div>
        As with text, the <code>useDynamicRowHeight</code> hook can be used to
        measure images.
      </div>
      <Code html={ImagesMarkdown.html} />
      <div>
        A loading placeholder might be rendered until the image has been
        measured for the first time.
      </div>
      <Code html={ImageRowMarkdown.html} />
    </Box>
  );
}
