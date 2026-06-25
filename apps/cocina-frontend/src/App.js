import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import CocinaScreen from "./screens/CocinaScreen";
import ConfigScreen from "./screens/ConfigScreen";
import MenuStockScreen from "./screens/MenuStockScreen";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={LoginScreen} />
                <PrivateRoute path="/" component={CocinaScreen} exact />
                <PrivateRoute path="/config" component={ConfigScreen} />
                <PrivateRoute path="/menu" component={MenuStockScreen} />
            </Switch>
        </Router>
    );
};

export default App;
