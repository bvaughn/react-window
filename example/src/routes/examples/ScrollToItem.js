import React, { Component } from "react";
import { FixedSizeGrid, FixedSizeList } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

export default class ScrollToItem extends Component {
  gridRef = React.createRef();
  listRef = React.createRef();

  render() {
    return (
      <div className="ExampleWrapper">
        <div className="Example">
          <div className="ExampleDemo">
            <button className="ExampleButton" onClick={this.scrollToRow200Auto}>
              Scroll to row 200
            </button>
            <button className="ExampleButton" onClick={this.scrollToRow300Center}>
              Scroll to row 300 (align: center)
            </button>
            <FixedSizeList
              cellSize={35}
              className="List"
              count={1000}
              height={150}
              ref={this.listRef}
              width={300}
            >
              {({ key, index, style }) => (
                <div
                  className={index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                  key={key}
                  style={style}
                >
                  Row {index}
                </div>
              )}
            </FixedSizeList>

            <div className="TryItOutLink">
              <CodeSandboxLink to="#" />
            </div>
          </div>
          <div className="ExampleCode">
            <CodeBlock value={SNIPPET_LIST} />
          </div>
        </div>
        <div className="Example">
          <div className="ExampleDemo">
            <button className="ExampleButton" onClick={this.scrollToRow100Column50Auto}>
              Scroll to row 100, column 50
            </button>
            <button className="ExampleButton" onClick={this.scrollToRow300Column150Start}>
              Scroll to row 300, column 150 (align: start)
            </button>
            <FixedSizeGrid
              className="Grid"
              columnCount={1000}
              columnWidth={100}
              height={150}
              ref={this.gridRef}
              rowCount={1000}
              rowHeight={35}
              width={300}
            >
              {({ columnIndex, key, rowIndex, style }) => (
                <div
                  className={columnIndex % 2 ? (rowIndex % 2 === 0 ? 'GridItemOdd' : 'GridItemEven') : (rowIndex % 2 ? 'GridItemOdd' : 'GridItemEven')}
                  key={key}
                  style={style}
                >
                  r{rowIndex}, c{columnIndex}
                </div>
              )}
            </FixedSizeGrid>

            <div className="TryItOutLink">
              <CodeSandboxLink to="#" />
            </div>
          </div>
          <div className="ExampleCode">
            <CodeBlock value={SNIPPET_GRID} />
          </div>
        </div>
      </div>
    );
  }

  scrollToRow200Auto = () => {
    this.listRef.current.scrollToItem(200);
  };
  scrollToRow300Center = () => {
    this.listRef.current.scrollToItem(300, "center");
  };

  scrollToRow100Column50Auto = () => {
    this.gridRef.current.scrollToItem({
      columnIndex: 50,
      rowIndex: 100
    });
  };

  scrollToRow300Column150Start = () => {
    this.gridRef.current.scrollToItem({
      align: "start",
      columnIndex: 150,
      rowIndex: 300
    });
  };
}

const SNIPPET_LIST = `
import { FixedSizeList as List } from 'react-virtualized';

const listRef = React.createRef();

// You can programatically scroll to a item within a List.
// First, attach a ref to the List:
<List ref={listRef} {...props} />

// Then call the scrollToItem() API method with an item index:
listRe.current.scrollToItem(200);

// The List will scroll as little as possible to ensure the item is visible.
// You can also specify a custom alignment: center, start, or end.
// For example:
listRe.current.scrollToItem(300, "center");
`;

const SNIPPET_GRID = `
import { FixedSizeGrid as Grid } from 'react-virtualized';

const gridRef = React.createRef();

// You can programatically scroll to a item within a Grid.
// First, attach a ref to the Grid:
<Grid ref={gridRef} {...props} />

// Then call the scrollToItem() API method with the item indices:
gridRef.current.scrollToItem({
  columnIndex: 50,
  rowIndex: 100
});

// The Grid will scroll as little as possible to ensure the item is visible.
// You can also specify a custom alignment: center, start, or end.
// For example:
gridRef.current.scrollToItem({
  align: "start",
  columnIndex: 150,
  rowIndex: 300
});
`;