import { FixedSizeList as List } from 'react-virtualized';

// If your component's items are expensive to render,
// You can boost performance by rendering a placeholder while the user is scrolling.
// To do this, add the \`useIsScrolling\` property to your List or Grid.
// Now an additional parameter, \`isScrolling\`, will be passed to your render method:
<List useIsScrolling {...props}>
  {({ key, index, isScrolling, style }) => (
    <div key={key} style={style}>
      {isScrolling ? 'Scrolling' : `Row ${index}`}
    </div>
  )}
</List>