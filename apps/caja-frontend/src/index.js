import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || `${process.env.HOST || "http://localhost"}:${process.env.RESTO_BACKEND_PORT || 5000}`;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
