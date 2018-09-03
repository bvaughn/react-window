import memoize from 'memoize-one';
import React, { PureComponent } from 'react';
import { FixedSizeList } from 'react-window';
import CodeBlock from '../../components/CodeBlock';
import ProfiledExample from '../../components/ProfiledExample';

import CODE from '../../code/MemoizedListItems.js';

import styles from './shared.module.css';

const generateItems = numItems =>
  Array(numItems)
    .fill(true)
    .map(_ => ({
      isActive: false,
      label: Math.random()
        .toString(36)
        .substr(2),
    }));

class ItemRenderer extends PureComponent {
  render() {
    const { data, index, style } = this.props;
    const { items, toggleItemActive } = data;
    const item = items[index];

    return (
      <div
        className={index % 2 ? styles.ListItemOdd : styles.ListItemEven}
        onClick={() => toggleItemActive(index)}
        style={{
          ...style,
          userSelect: 'none',
          cursor: 'pointer',
        }}
      >
        {item.label} is&nbsp;
        <span
          style={{
            color: item.isActive ? '#3D3' : '#F33',
          }}
        >
          {item.isActive ? 'active' : 'inactive'}
        </span>
      </div>
    );
  }
}

export default class MemoizedListItemsExample extends PureComponent {
  state = {
    items: generateItems(1000),
  };

  toggleItemActive = index =>
    this.setState(prevState => {
      const item = prevState.items[index];
      const items = prevState.items.concat();
      items[index] = {
        ...item,
        isActive: !item.isActive,
      };
      return { items };
    });

  render() {
    const { items } = this.state;
    const itemData = getItemData(items, this.toggleItemActive);

    return (
      <div className={styles.ExampleWrapper}>
        <h1 className={styles.ExampleHeader}>Basic List</h1>
        <div className={styles.Example}>
          <ProfiledExample
            className={styles.ExampleDemo}
            sandbox="memoized-list-items"
          >
            <FixedSizeList
              className={styles.List}
              height={150}
              itemCount={items.length}
              itemData={itemData}
              itemSize={35}
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
}

const getItemData = memoize((items, toggleItemActive) => ({
  items,
  toggleItemActive,
}));
