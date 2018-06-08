import React from 'react';
import { VariableSizeGrid } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE from '../../code/VariableSizeGrid.js';

import styles from './shared.module.css';

const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Variable Size Grid</h1>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <VariableSizeGrid
            className={styles.Grid}
            columnCount={1000}
            columnWidth={index => columnWidths[index]}
            height={150}
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

          <CodeSandboxLink
            className={styles.TryItOutLink}
            sandbox="variable-size-grid"
          />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
