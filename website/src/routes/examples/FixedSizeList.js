import React from 'react';
import { FixedSizeList } from 'react-window';
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
            className={styles.List}
            height={150}
            itemCount={1000}
            itemSize={35}
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
          </FixedSizeList>

          <CodeSandboxLink
            className={styles.TryItOutLink}
            sandbox="fixed-size-list-vertical"
          />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_VERTICAL} />
        </div>
      </div>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <FixedSizeList
            className={styles.List}
            direction="horizontal"
            height={75}
            itemCount={1000}
            itemSize={100}
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
          </FixedSizeList>

          <CodeSandboxLink
            className={styles.TryItOutLink}
            sandbox="fixed-size-list-horizontal"
          />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_HORIZONTAL} />
        </div>
      </div>
    </div>
  );
}
