import { Block } from "../../components/Block";
import Code from "../../components/code/Code";
import { ExampleLayout } from "../../components/ExampleLayout";

export function ScrollingIndicators() {
  return (
    <ExampleLayout>
      <Block>TODO</Block>
      <Code code={CODE} />
    </ExampleLayout>
  );
}

const CODE = `
import { FixedSizeList as List } from 'react-window';
 
const Row = ({ index, isScrolling, style }) => (
  <div style={style}>
    {isScrolling ? 'Scrolling' : \`Row \${index}\`}
  </div>
);
 
// If your component's items are expensive to render,
// You can boost performance by rendering a placeholder while the user is scrolling.
// To do this, add the "useIsScrolling" property to your List or Grid.
// Now an additional parameter, "isScrolling", will be passed to your render method:
const Example = props => (
  <List useIsScrolling {...props}>
    {Row}
  </List>
);
`;
