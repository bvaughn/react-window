import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Nav } from './components/Nav';
import { SubMenu } from './components/SubMenu';

// Routes
import VariableSizeGridApi from './routes/api/VariableSizeGrid';
import VariableSizeGridExample from './routes/examples/VariableSizeGrid';
import VariableSizeListApi from './routes/api/VariableSizeList';
import VariableSizeListExample from './routes/examples/VariableSizeList';
import FixedSizeGridApi from './routes/api/FixedSizeGrid';
import FixedSizeListApi from './routes/api/FixedSizeList';
import FixedSizeGridExample from './routes/examples/FixedSizeGrid';
import FixedSizeListExample from './routes/examples/FixedSizeList';
import ListWithScrollingIndicatorExample from './routes/examples/ListWithScrollingIndicator';
import ScrollToItemExample from './routes/examples/ScrollToItem';

import styles from './App.module.css';

export default function App() {
  return (
    <Router>
      <div className={styles.App}>
        <Nav title="react-virtualized">
          <SubMenu
            isActiveDark={true}
            items={EXAMPLE_ROUTES}
            title="Examples"
          />
          <SubMenu isActiveDark={false} items={API_ROUTES} title="API" />
        </Nav>
        <main className={styles.Main}>
          <Route
            exact
            path="/"
            render={() => <Redirect to={EXAMPLE_ROUTES[0].path} />}
          />

          {EXAMPLE_ROUTES.map(({ component, path }) => (
            <Route key={path} path={path} component={component} />
          ))}

          {API_ROUTES.map(({ component, path }) => (
            <Route key={path} path={path} component={component} />
          ))}
        </main>
      </div>
    </Router>
  );
}

// TODO Add a route showing how to use PureComponent for expensive cells.

const EXAMPLE_ROUTES = [
  {
    path: '/examples/list/fixed-size',
    title: 'Fixed Size List',
    component: FixedSizeListExample,
  },
  {
    path: '/examples/list/variable-size',
    title: 'Variable Size List',
    component: VariableSizeListExample,
  },
  {
    path: '/examples/grid/fixed-size',
    title: 'Fixed Size Grid',
    component: FixedSizeGridExample,
  },
  {
    path: '/examples/grid/variable-size',
    title: 'Variable Size Grid',
    component: VariableSizeGridExample,
  },
  {
    path: '/examples/list/scrolling-indicators',
    title: 'Scrolling indicators',
    component: ListWithScrollingIndicatorExample,
  },
  {
    path: '/examples/list/scroll-to-cell',
    title: 'Scrolling to an item',
    component: ScrollToItemExample,
  },
];

const API_ROUTES = [
  {
    path: '/api/FixedSizeList',
    title: 'FixedSizeList',
    component: FixedSizeListApi,
  },
  {
    path: '/api/VariableSizeList',
    title: 'VariableSizeList',
    component: VariableSizeListApi,
  },
  {
    path: '/api/FixedSizeGrid',
    title: 'FixedSizeGrid',
    component: FixedSizeGridApi,
  },
  {
    path: '/api/VariableSizeGrid',
    title: 'VariableSizeGrid',
    component: VariableSizeGridApi,
  },
];
