import React, { PureComponent, useRef } from 'react';
import { FixedSizeGrid, FixedSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE_GRID from '../../code/FixedSizeGridRtl.js';
import CODE_LIST from '../../code/FixedSizeListHorizontalRtl.js';

import styles from './shared.module.css';

class Cell extends PureComponent {
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
        بند {rowIndex}, {columnIndex}
      </div>
    );
  }
}

class Item extends PureComponent {
  render() {
    const { index, style } = this.props;

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        style={style}
      >
        عمود {index}
      </div>
    );
  }
}

export default function() {
  const gridRef = useRef();
  const listRef = useRef();

  const scrollGridTo500 = () => gridRef.current.scrollTo({ scrollLeft: 500 });
  const scrollGridTo1500 = () => gridRef.current.scrollTo({ scrollLeft: 1500 });
  const scrollGridToItem8Auto = () =>
    gridRef.current.scrollToItem({ columnIndex: 8 });
  const scrollGridToItem12Center = () =>
    gridRef.current.scrollToItem({ columnIndex: 12, align: 'center' });

  const scrollListTo500 = () => listRef.current.scrollTo(500);
  const scrollListTo1500 = () => listRef.current.scrollTo(1500);
  const scrollListToItem8Auto = () => listRef.current.scrollToItem(8);
  const scrollListToItem12Center = () =>
    listRef.current.scrollToItem(12, 'center');

  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>RTL List</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="fixed-size-list-horizontal-rtl"
        >
          <button
            className={styles.ExampleButton}
            onClick={scrollListToItem8Auto}
          >
            Scroll to item 8 (align: auto)
          </button>
          <button
            className={styles.ExampleButton}
            onClick={scrollListToItem12Center}
          >
            Scroll to item 12 (align: center)
          </button>
          <button className={styles.ExampleButton} onClick={scrollListTo500}>
            Scroll to 500
          </button>
          <button className={styles.ExampleButton} onClick={scrollListTo1500}>
            Scroll to 1500
          </button>
          <FixedSizeList
            className={styles.List}
            direction="rtl"
            height={75}
            itemCount={20}
            itemSize={100}
            layout="horizontal"
            ref={listRef}
            width={300}
          >
            {Item}
          </FixedSizeList>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_LIST} />
        </div>
      </div>
      <h1 className={styles.ExampleHeader}>RTL Grid</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="fixed-size-grid-rtl"
        >
          <button
            className={styles.ExampleButton}
            onClick={scrollGridToItem8Auto}
          >
            Scroll to column 8 (align: auto)
          </button>
          <button
            className={styles.ExampleButton}
            onClick={scrollGridToItem12Center}
          >
            Scroll to column 12 (align: center)
          </button>
          <button className={styles.ExampleButton} onClick={scrollGridTo500}>
            Scroll to 500
          </button>
          <button className={styles.ExampleButton} onClick={scrollGridTo1500}>
            Scroll to 1500
          </button>
          <FixedSizeGrid
            className={styles.Grid}
            columnCount={20}
            columnWidth={100}
            direction="rtl"
            height={150}
            ref={gridRef}
            rowCount={20}
            rowHeight={35}
            width={300}
          >
            {Cell}
          </FixedSizeGrid>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_GRID} />
        </div>
      </div>
    </div>
  );
}
