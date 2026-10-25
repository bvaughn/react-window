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
        Images are an example of{" "}
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
        If the dimensions of each image are known ahead of time, pass them to
        the <code>&lt;img&gt;</code> as <code>width</code> and{" "}
        <code>height</code> attributes. The browser will reserve space for the
        image before it loads, so rows are measured at the correct size right
        away (rather than resizing once the image arrives). A placeholder can be
        rendered behind the image while it loads.
      </div>
      <Code html={ImageRowMarkdown.html} />
    </Box>
  );
}
