import React, { PureComponent } from 'react';
import { FixedSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE_HORIZONTAL from '../../code/FixedSizeListHorizontal.js';
import CODE_VERTICAL from '../../code/FixedSizeListVertical.js';

import styles from './shared.module.css';

class Item extends PureComponent {
  render() {
    const { index, style } = this.props;

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        style={style}
      >
        Item {index}
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
          sandbox="fixed-size-list-vertical"
        >
          <FixedSizeList
            className={styles.List}
            height={150}
            itemCount={1000}
            itemSize={35}
            width={300}
          >
            {Item}
          </FixedSizeList>
        </ProfiledExample>
        <div className={styles.ExampleCode}>
          <CodeBlock value={CODE_VERTICAL} />
        </div>
      </div>
      <div className={styles.Example}>
        <ProfiledExample
          className={styles.ExampleDemo}
          sandbox="fixed-size-list-horizontal"
        >
          <FixedSizeList
            className={styles.List}
            direction="horizontal"
            height={75}
            itemCount={1000}
            itemSize={100}
            width={300}
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
