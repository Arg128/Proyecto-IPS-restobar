import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import axios from "axios";
import store from "./store";
import App from "./App";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || `${process.env.HOST || "http://localhost"}:${process.env.COCINA_BACKEND_PORT || 5001}`;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
