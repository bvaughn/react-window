import React, { Component } from "react";
import { DynamicList, FixedSizeGrid } from "react-virtualized-v10";
import CodeBlock from "../../components/CodeBlock";
import CodeSandboxLink from "../../components/CodeSandboxLink";

import CODE_GRID from "../../code/ScrollToItemGrid.js";
import CODE_LIST from "../../code/ScrollToItemList.js";

const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50));

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
            <DynamicList
              cellSize={index => rowSizes[index]}
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
            </DynamicList>

            <CodeSandboxLink className="TryItOutLink" id="mzy8pq360x" />
          </div>
          <div className="ExampleCode">
            <CodeBlock value={CODE_LIST} />
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

            <CodeSandboxLink className="TryItOutLink" id="woy6mknj4w" />
          </div>
          <div className="ExampleCode">
            <CodeBlock value={CODE_GRID} />
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