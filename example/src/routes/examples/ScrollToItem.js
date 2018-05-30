import React, { Component } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-virtualized-v10';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE_GRID from '../../code/ScrollToItemGrid.js';
import CODE_LIST from '../../code/ScrollToItemList.js';

import styles from './shared.module.css';

const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

export default class ScrollToItem extends Component {
  gridRef = React.createRef();
  listRef = React.createRef();

  render() {
    return (
      <div className={styles.ExampleWrapper}>
        <h1 className={styles.ExampleHeader}>Scrolling to an item</h1>
        <div className={styles.Example}>
          <div className={styles.ExampleDemo}>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow200Auto}
            >
              Scroll to row 200 (align: auto)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow300Center}
            >
              Scroll to row 300 (align: center)
            </button>
            <VariableSizeList
              className={styles.List}
              height={150}
              itemCount={1000}
              itemSize={index => rowHeights[index]}
              ref={this.listRef}
              width={300}
            >
              {({ index, style }) => (
                <div
                  className={
                    index % 2 ? styles.ListItemOdd : styles.ListItemEven
                  }
                  style={style}
                >
                  Row {index}
                </div>
              )}
            </VariableSizeList>

            <CodeSandboxLink className={styles.TryItOutLink} id="mzy8pq360x" />
          </div>
          <div className={styles.ExampleCode}>
            <CodeBlock value={CODE_LIST} />
          </div>
        </div>
        <div className={styles.Example}>
          <div className={styles.ExampleDemo}>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow100Column50Auto}
            >
              Scroll to row 100, column 50 (align: auto)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow300Column150Start}
            >
              Scroll to row 300, column 150 (align: start)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow350Column200End}
            >
              Scroll to row 350, column 200 (align: end)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow200Column100Center}
            >
              Scroll to row 200, column 100 (align: center)
            </button>
            <VariableSizeGrid
              className={styles.Grid}
              columnCount={1000}
              columnWidth={index => columnWidths[index]}
              height={150}
              ref={this.gridRef}
              rowCount={1000}
              rowHeight={index => rowHeights[index]}
              width={300}
            >
              {({ columnIndex, rowIndex, style }) => (
                <div
                  className={
                    columnIndex % 2
                      ? rowIndex % 2 === 0
                        ? styles.GridItemOdd
                        : styles.GridItemEven
                      : rowIndex % 2
                        ? styles.GridItemOdd
                        : styles.GridItemEven
                  }
                  style={style}
                >
                  r{rowIndex}, c{columnIndex}
                </div>
              )}
            </VariableSizeGrid>

            <CodeSandboxLink className={styles.TryItOutLink} id="woy6mknj4w" />
          </div>
          <div className={styles.ExampleCode}>
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
    this.listRef.current.scrollToItem(300, 'center');
  };

  scrollToRow100Column50Auto = () => {
    this.gridRef.current.scrollToItem({
      columnIndex: 50,
      rowIndex: 100,
    });
  };

  scrollToRow300Column150Start = () => {
    this.gridRef.current.scrollToItem({
      align: 'start',
      columnIndex: 150,
      rowIndex: 300,
    });
  };

  scrollToRow350Column200End = () => {
    this.gridRef.current.scrollToItem({
      align: 'end',
      columnIndex: 350,
      rowIndex: 200,
    });
  };

  scrollToRow200Column100Center = () => {
    this.gridRef.current.scrollToItem({
      align: 'center',
      columnIndex: 200,
      rowIndex: 100,
    });
  };
}
