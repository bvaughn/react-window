import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Nav } from './components/Nav';
import { SubMenu } from './components/SubMenu';

// Routes
import DynamicGridApi from './routes/api/DynamicGrid';
import DynamicGridExample from './routes/examples/DynamicGrid';
import DynamicListApi from './routes/api/DynamicList';
import DynamicListExample from './routes/examples/DynamicList';
import FixedSizeGridApi from './routes/api/FixedSizeGrid';
import FixedSizeListApi from './routes/api/FixedSizeList';
import FixedSizeGridExample from './routes/examples/FixedSizeGrid';
import FixedSizeListExample from './routes/examples/FixedSizeList';
import ListWithScrollingIndicatorExample from './routes/examples/ListWithScrollingIndicator';
import ScrollToItemExample from './routes/examples/ScrollToItem';

import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Nav title="react-virtualized">
          <SubMenu
            isActiveDark={true}
            items={EXAMPLE_ROUTES}
            title="Examples"
          />
          <SubMenu isActiveDark={false} items={API_ROUTES} title="API" />
        </Nav>
        <main className="Main">
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

const EXAMPLE_ROUTES = [
  {
    path: '/examples/list/fixed-size',
    title: 'Basic List',
    component: FixedSizeListExample,
  },
  {
    path: '/examples/list/dynamic',
    title: 'Dynamic List',
    component: DynamicListExample,
  },
  {
    path: '/examples/grid/fixed-size',
    title: 'Basic Grid',
    component: FixedSizeGridExample,
  },
  {
    path: '/examples/grid/dynamic',
    title: 'Dynamic Grid',
    component: DynamicGridExample,
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
    path: '/api/DynamicList',
    title: 'DynamicList',
    component: DynamicListApi,
  },
  {
    path: '/api/FixedSizeGrid',
    title: 'FixedSizeGrid',
    component: FixedSizeGridApi,
  },
  {
    path: '/api/DynamicGrid',
    title: 'DynamicGrid',
    component: DynamicGridApi,
  },
];
