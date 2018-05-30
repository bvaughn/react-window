import React from 'react';
import { VariableSizeList } from 'react-virtualized-v10';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE_HORIZONTAL from '../../code/VariableSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/VariableSizeListVertical.js';

import styles from './shared.module.css';

const columnSizes = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowSizes = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Variable Size List</h1>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <VariableSizeList
            className={styles.List}
            height={150}
            itemCount={1000}
            itemSize={index => rowSizes[index]}
            width={300}
          >
            {({ index, style }) => (
              <div
                className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
                style={style}
              >
                Row {index}
              </div>
            )}
          </VariableSizeList>

          <CodeSandboxLink className={styles.TryItOutLink} id="j3nw3nnnyy" />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_VERTICAL} />
        </div>
      </div>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <VariableSizeList
            className={styles.List}
            direction="horizontal"
            height={75}
            itemCount={1000}
            itemSize={index => columnSizes[index]}
            width={300}
          >
            {({ index, style }) => (
              <div
                className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
                style={style}
              >
                Column {index}
              </div>
            )}
          </VariableSizeList>

          <CodeSandboxLink className={styles.TryItOutLink} id="jnl8ljmnn5" />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_HORIZONTAL} />
        </div>
      </div>
    </div>
  );
}
