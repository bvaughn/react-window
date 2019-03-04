import React, { PureComponent } from 'react';
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
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>RTL List</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="fixed-size-list-horizontal-rtl"
        >
          <FixedSizeList
            className={styles.List}
            direction="rtl"
            height={75}
            itemCount={1000}
            itemSize={100}
            layout="horizontal"
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
          <FixedSizeGrid
            className={styles.Grid}
            columnCount={1000}
            columnWidth={100}
            direction="rtl"
            height={150}
            rowCount={1000}
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
