import React, { PureComponent } from 'react';
import { FixedSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE_HORIZONTAL from '../../code/FixedSizeListHorizontalRtl.js';
import CODE_VERTICAL from '../../code/FixedSizeListVerticalRtl.js';

import styles from './shared.module.css';

class Item extends PureComponent {
  render() {
    const { data, index, style } = this.props;

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        style={style}
      >
        {data} {index}
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
            itemData="صف"
            itemSize={35}
            width={300}
            style={{ direction: "rtl" }}
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
            itemData="عمود"
            itemSize={100}
            width={300}
            style={{ direction: "rtl" }}
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
