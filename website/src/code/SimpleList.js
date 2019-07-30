import { SimpleList as List } from 'react-window';

const Example = () => (
  <List
    height={150}
    itemCount={1000}
    itemRenderer={
      ({ index, key, style }) => (
        <div key={key} style={style}>Row {index}</div>
      )
    }
    itemSize={35}
    width={300}
  />
);