import React from 'react';
import { FixedSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import CodeSandboxLink from '../../components/CodeSandboxLink';

import CODE from '../../code/ScrollingIndicatorList.js';

import styles from './shared.module.css';

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Scrolling indicators</h1>
      <div className={styles.Example}>
        <div className={styles.ExampleDemo}>
          <FixedSizeList
            className={styles.List}
            height={150}
            itemCount={1000}
            itemSize={35}
            useIsScrolling
            width={300}
          >
            {({ index, isScrolling, style }) => (
              <div
                className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
                style={style}
              >
                {isScrolling ? 'Scrolling' : `Row ${index}`}
              </div>
            )}
          </FixedSizeList>

          <CodeSandboxLink className={styles.TryItOutLink} id="3qw073y3x6" />
        </div>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
