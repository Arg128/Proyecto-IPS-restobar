import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import OrderViewScreen from "./screens/OrderViewScreen";
import OrderCreateScreen from "./screens/OrderCreateScreen";

const App = () => {
    return (
        <Router>
            <Header />
            <Sidebar />
            <div className="content-wrapper" style={{ minHeight: "100vh", padding: "15px" }}>
                <Switch>
                    <Route exact path="/" render={() => <HomeScreen />} />
                    <Route exact path="/delivery" render={() => <DeliveryScreen />} />
                    <Route exact path="/order/:id/view" render={(props) => <OrderViewScreen {...props} />} />
                    <Route exact path="/order/create" render={(props) => <OrderCreateScreen {...props} />} />
                </Switch>
            </div>
            <Footer />
        </Router>
    );
};

export default App;