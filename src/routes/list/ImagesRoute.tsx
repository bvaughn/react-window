import { Block } from "../../components/Block";
import { Box } from "../../components/Box";
import { Code } from "../../components/code/Code";
import { Header } from "../../components/Header";
import { ExampleWithImages } from "./examples/Images.example";
import ImageRowMarkdown from "../../../public/generated/code-snippets/ImageRow.json";
import ImagesMarkdown from "../../../public/generated/code-snippets/Images.json";
import useImageSizeCacheMarkdown from "../../../public/generated/code-snippets/useImageSizeCache.json";

export default function ImagesRoute() {
  return (
    <Box direction="column" gap={4}>
      <Header section="Other" title="Variable size images" />
      <div>
        Lists can be used to render content of unknown sizes, though it requires
        a user-provided cache.
      </div>
      <div>Here's an example of a list of images of varying sizes:</div>
      <Block className="h-150" data-focus-within="bold">
        <ExampleWithImages />
      </Block>
      <div>
        First, let's look at the custom cache we'll use to store image sizes.
      </div>
      <Code html={useImageSizeCacheMarkdown.html} />
      <div>
        When a row is rendered for the first time, it should record the image
        size in the cache.
      </div>
      <Code html={ImageRowMarkdown.html} />
      <div>The list can use the cache to determine the size of each row.</div>
      <Code html={ImagesMarkdown.html} />
    </Box>
  );
}
