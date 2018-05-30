import React from 'react';
import { FixedSizeGrid } from 'react-virtualized-v10';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE from '../../code/FixedSizeGrid.js';

import styles from './shared.module.css';

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Basic Grid</h1>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <FixedSizeGrid
            className={styles.Grid}
            columnCount={1000}
            columnWidth={100}
            height={150}
            rowCount={1000}
            rowHeight={35}
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
          </FixedSizeGrid>

          <CodeSandboxLink className={styles.TryItOutLink} id="1rp83rw8wl" />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
