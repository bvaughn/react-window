import React, { PureComponent } from 'react';
import { FixedSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE from '../../code/ScrollingIndicatorList.js';

import styles from './shared.module.css';

class ItemRenderer extends PureComponent {
  render() {
    const { index, isScrolling, style } = this.props;

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        style={style}
      >
        {isScrolling ? 'Scrolling' : `Row ${index}`}
      </div>
    );
  }
}

export default function() {
  return (
    <div className={styles.ExampleWrapper}>
      <h1 className={styles.ExampleHeader}>Scrolling indicators</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="scrolling-indicators"
        >
          <FixedSizeList
            className={styles.List}
            height={150}
            itemCount={1000}
            itemSize={35}
            useIsScrolling
            width={300}
          >
            {ItemRenderer}
          </FixedSizeList>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE} />
        </div>
      </div>
    </div>
  );
}
