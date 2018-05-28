import React from 'react';
import { FixedSizeList } from 'react-virtualized-v10';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE_HORIZONTAL from '../../code/FixedSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/FixedSizeListVertical.js';

import styles from './shared.module.css';

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Basic List</h1>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <FixedSizeList
            cellSize={35}
            className={styles.List}
            count={1000}
            height={150}
            width={300}
          >
            {({ key, index, style }) => (
              <div
                className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
                key={key}
                style={style}
              >
                Row {index}
              </div>
            )}
          </FixedSizeList>

          <CodeSandboxLink className={styles.TryItOutLink} id="vjo8w37qw0" />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_VERTICAL} />
        </div>
      </div>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <FixedSizeList
            cellSize={100}
            className={styles.List}
            direction="horizontal"
            count={1000}
            height={75}
            width={300}
          >
            {({ key, index, style }) => (
              <div
                className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
                key={key}
                style={style}
              >
                Column {index}
              </div>
            )}
          </FixedSizeList>

          <CodeSandboxLink className={styles.TryItOutLink} id="n4wwlyn8rm" />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_HORIZONTAL} />
        </div>
      </div>
    </div>
  );
}
