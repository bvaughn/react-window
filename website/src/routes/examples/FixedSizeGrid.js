import React, { PureComponent } from 'react';
import { FixedSizeGrid } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE from '../../code/FixedSizeGrid.js';

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
        Item {rowIndex},{columnIndex}
      </div>
    );
  }
}

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Basic Grid</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="fixed-size-grid"
        >
          <FixedSizeGrid
            className={styles.Grid}
            columnCount={1000}
            columnWidth={100}
            height={150}
            rowCount={1000}
            rowHeight={35}
            width={300}
          >
            {Cell}
          </FixedSizeGrid>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
