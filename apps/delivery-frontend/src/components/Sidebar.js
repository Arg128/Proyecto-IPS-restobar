import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <Link to="/" className="brand-link">
                <span className="brand-text font-weight-light">
                    <i className="fas fa-truck mr-2" />
                    Delivery
                </span>
            </Link>

            {/* Sidebar */}
            <div className="sidebar">
                <nav className="mt-2">
                    <ul
                        className="nav nav-pills nav-sidebar flex-column"
                        data-widget="treeview"
                        role="menu"
                    >
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <i className="nav-icon fas fa-tachometer-alt" />
                                <p>Inicio</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/delivery" className="nav-link">
                                <i className="nav-icon fas fa-truck" />
                                <p>Pedidos Delivery</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/order/create" className="nav-link">
                                <i className="nav-icon fas fa-plus" />
                                <p>Nuevo Pedido</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;