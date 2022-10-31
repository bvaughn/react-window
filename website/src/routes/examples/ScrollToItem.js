import React, { PureComponent } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { unstable_trace as trace } from 'scheduler/tracing';

import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';
import { fillArray } from '../../utils';

import CODE_GRID from '../../code/ScrollToItemGrid.js';
import CODE_LIST from '../../code/ScrollToItemList.js';

import styles from './shared.module.css';

const columnWidths = fillArray(1000, () => 75 + Math.round(Math.random() * 50));
const rowHeights = fillArray(1000, () => 25 + Math.round(Math.random() * 50));

class ListItemRenderer extends PureComponent {
  render() {
    const { index, style } = this.props;

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        style={style}
      >
        Row {index}
      </div>
    );
  }
}

class GridItemRenderer extends PureComponent {
  render() {
    const { columnIndex, rowIndex, style } = this.props;

    return (
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
        Item {rowIndex},{columnIndex}
      </div>
    );
  }
}

export default class ScrollToItem extends PureComponent {
  gridRef = React.createRef();
  listRef = React.createRef();

  render() {
    return (
      <div className={styles.ExampleWrapper}>
        <h1 className={styles.ExampleHeader}>Scrolling to an item</h1>
        <div className={styles.Example}>
          <ProfiledExample
            className={styles.ExampleDemo}
            sandbox="scrolling-to-a-list-item"
          >
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow200Auto}
            >
              Scroll to row 200 (align: auto)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow250Smart}
            >
              Scroll to row 250 (align: smart)
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
              {ListItemRenderer}
            </VariableSizeList>
          </ProfiledExample>
          <div className={styles.ExampleCode}>
            <CodeBlock value={CODE_LIST} />
          </div>
        </div>
        <div className={styles.Example}>
          <ProfiledExample
            className={styles.ExampleDemo}
            sandbox="scrolling-to-a-grid-item"
          >
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
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow250Column150Smart}
            >
              Scroll to row 250, column 150 (align: smart)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToRow100}
            >
              Scroll to row 100 (align: auto)
            </button>
            <button
              className={styles.ExampleButton}
              onClick={this.scrollToColumn50Auto}
            >
              Scroll to column 50 (align: auto)
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
              {GridItemRenderer}
            </VariableSizeGrid>
          </ProfiledExample>
          <div className={styles.ExampleCode}>
            <CodeBlock value={CODE_GRID} />
          </div>
        </div>
      </div>
    );
  }

  scrollToColumn50Auto = () => {
    this.gridRef.current.scrollToItem({
      columnIndex: 50,
    });
  };

  scrollToRow200Auto = () =>
    trace('scroll to row 200', performance.now(), () =>
      this.listRef.current.scrollToItem(200)
    );
  scrollToRow300Center = () =>
    trace('scroll to row 300', performance.now(), () =>
      this.listRef.current.scrollToItem(300, 'center')
    );

  scrollToRow250Smart = () => {
    trace('scroll to row 250', performance.now(), () =>
      this.listRef.current.scrollToItem(250, 'smart')
    );
  };

  scrollToRow100 = () => {
    this.gridRef.current.scrollToItem({
      rowIndex: 100,
    });
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
      columnIndex: 200,
      rowIndex: 350,
    });
  };

  scrollToRow200Column100Center = () => {
    this.gridRef.current.scrollToItem({
      align: 'center',
      columnIndex: 100,
      rowIndex: 200,
    });
  };

  scrollToRow250Column150Smart = () => {
    this.gridRef.current.scrollToItem({
      align: 'smart',
      columnIndex: 150,
      rowIndex: 250,
    });
  };
}
