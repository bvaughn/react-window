import React, { PureComponent } from 'react';
import { VariableSizeGrid } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';
import { fillArray } from '../../utils';

import CODE from '../../code/VariableSizeGrid.js';

import styles from './shared.module.css';

const columnWidths = fillArray(1000, () => 75 + Math.round(Math.random() * 50));
const rowHeights = fillArray(1000, () => 25 + Math.round(Math.random() * 50));

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
      <h1 className={styles.ExampleHeader}>Variable Size Grid</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="variable-size-grid"
        >
          <VariableSizeGrid
            className={styles.Grid}
            columnCount={1000}
            columnWidth={index => columnWidths[index]}
            height={150}
            rowCount={1000}
            rowHeight={index => rowHeights[index]}
            width={300}
          >
            {Cell}
          </VariableSizeGrid>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
