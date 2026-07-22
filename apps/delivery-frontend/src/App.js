import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import OrderViewScreen from "./screens/OrderViewScreen";
import OrderCreateScreen from "./screens/OrderCreateScreen";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/login" component={LoginScreen} />
                <Route exact path="/register" component={RegisterScreen} />
                <>
                    <Header />
                    <Sidebar />
                    <div className="content-wrapper" style={{ minHeight: "100vh", padding: "15px" }}>
                        <Switch>
                            <PrivateRoute exact path="/" component={HomeScreen} />
                            <PrivateRoute exact path="/delivery" component={DeliveryScreen} />
                            <PrivateRoute exact path="/order/:id/view" component={OrderViewScreen} />
                            <PrivateRoute exact path="/order/create" component={OrderCreateScreen} />
                        </Switch>
                    </div>
                    <Footer />
                </>
            </Switch>
        </Router>
    );
};

export default App;
