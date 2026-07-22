import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutClient } from "../actions/clientActions";

const Header = () => {
    const dispatch = useDispatch();

    const clientLogin = useSelector((state) => state.clientLogin);
    const { clientInfo } = clientLogin;

    const logoutHandler = () => {
        dispatch(logoutClient());
    };

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="/" role="button">
                        <i className="fas fa-bars" />
                    </a>
                </li>
                <li className="nav-item">
                    <span className="nav-link">
                        <i className="fas fa-truck" /> Delivery - Restobar
                    </span>
                </li>
            </ul>
            {clientInfo && (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <span className="nav-link">
                            <i className="fas fa-user" /> {clientInfo.name}
                        </span>
                    </li>
                    <li className="nav-item">
                        <button
                            className="btn btn-link nav-link"
                            onClick={logoutHandler}
                            style={{ cursor: "pointer" }}
                        >
                            <i className="fas fa-sign-out-alt" /> Salir
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default Header;
