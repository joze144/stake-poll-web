import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';

import { createStores } from './stores';

import './styles/app.scss';
import FieldList from './components/FieldList';

const stores = createStores();

render(
  <Provider {...stores}>
    <div>
      <h1>Player</h1>
      <div className="wrapper">
        <FieldList isPlayer={true} />
      </div>
      <br />
      <h1>Opponent</h1>
      <div className="wrapper">
        <FieldList isPlayer={false} />
      </div>
    </div>
  </Provider>,
  document.getElementById('root'),
);
