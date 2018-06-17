import React, { PureComponent } from 'react';
import { FixedSizeList } from 'react-window';

import appStyles from './App.module.css';
import listStyles from './routes/examples/shared.module.css';

const paths = [
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  'M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
  'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
  'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z',
  'M19.77 5.03l1.4 1.4L8.43 19.17l-5.6-5.6 1.4-1.4 4.2 4.2L19.77 5.03m0-2.83L8.43 13.54l-4.2-4.2L0 13.57 8.43 22 24 6.43 19.77 2.2z',
  'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
];

const names = [
  'Katharine Jacobson',
  'Rigoberto Bennett',
  'Claude Choi',
  'Brooke Garrison',
  'Emmitt Rasmussen',
  'Marguerite Buck',
  'Jeanette Guzman',
  'Jewel Mays',
  'Leandro Graham',
  'Hyman Morrow',
  'Eddie Buchanan',
  'Dario Ruiz',
  'Paul Love',
  'Margaret Donovan',
  'Grady Whitehead',
  'Valentine Roth',
  'Lorenzo Reid',
  'Charmaine Singh',
  'Christine Acevedo',
  'Tad Dean',
  'Toby Munoz',
  'Morgan Blevins',
  'Rocco Johns',
  'Luigi Mcintosh',
  'Roger Mcclain',
  'Korey Barry',
  'Dionne Hoffman',
  'Ila Lambert',
  'Hai Zamora',
  'Monroe Baldwin',
  'Jeanine Figueroa',
  'Lawrence Armstrong',
  'Candy Maynard',
  'Sylvester Howell',
  'Sydney Valencia',
  'Quentin Mathis',
  'Luella Stafford',
  'Leona Edwards',
  'Brooks Michael',
  'Adriana Poole',
  'Nickolas Daugherty',
  'Aron Doyle',
  'Adrienne Luna',
  'Roxie Velazquez',
  'Michale Barajas',
  'Von Coleman',
  'Sol Bailey',
  'Vicky West',
  'Rusty Kent',
  'Waylon Fuller',
];

const items = new Array(1000).fill().map(i => ({
  id: i,
  name: names[Math.floor(Math.random() * names.length)],
  path: paths[Math.floor(Math.random() * paths.length)],
}));

const Svg = ({ path }) => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d={path}/>
  </svg>
);

class ItemRenderer extends PureComponent {
  render() {
    const { index, style } = this.props;
    const item = items[index];

    return (
      <div
        className={index % 2 ? listStyles.ListItemOdd : listStyles.ListItemEven}
        style={style}
      >
        <span>{index}</span>
        <span>{item.name}</span>
        <Svg path={item.path} />
      </div>
    );
  }
}

export default function App() {
  return (
    <div className={appStyles.App}>
    <div className={appStyles.Main}>
      <h1>List A</h1>
      <FixedSizeList
        className={listStyles.List}
        height={400}
        itemCount={items.length}
        itemSize={35}
        width={300}
      >
        {ItemRenderer}
      </FixedSizeList>
    </div>
    <div className={appStyles.Main}>
      <h1>List B</h1>
      <FixedSizeList
        className={listStyles.List}
        height={400}
        itemCount={items.length}
        itemSize={35}
        width={300}
        useAdjustedOffsets
      >
        {ItemRenderer}
      </FixedSizeList>
    </div>
  </div>
  );
}
