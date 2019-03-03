import React, { PureComponent } from 'react';
import { FixedSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE_HORIZONTAL from '../../code/FixedSizeListHorizontalRtl.js';

import styles from './shared.module.css';

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
      <h1 className={styles.ExampleHeader}>Basic List</h1>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="fixed-size-list-horizontal"
        >
          <FixedSizeList
            className={styles.List}
            direction="rtl"
            height={75}
            itemCount={1000}
            itemSize={100}
            layout="horizontal"
            width={300}
            style={{ direction: 'rtl' }}
          >
            {Item}
          </FixedSizeList>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_HORIZONTAL} />
        </div>
      </div>
    </div>
  );
}
