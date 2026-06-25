import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux'
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || `${process.env.HOST || "http://localhost"}:${process.env.RESTO_BACKEND_PORT || 5000}`;

ReactDOM.render(

  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
