import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginClient } from "../actions/clientActions";

const LoginScreen = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const clientLogin = useSelector((state) => state.clientLogin);
    const { clientInfo, error, loading } = clientLogin;

    useEffect(() => {
        if (clientInfo) {
            history.push("/delivery");
        }
    }, [history, clientInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(loginClient(email, password));
    };

    return (
        <div
            className="row justify-content-center align-items-center vh-100"
            style={{ backgroundColor: "#cad5df" }}
        >
            <div className="login-box">
                <div className="card">
                    <div className="card-header">
                        <div className="login-logo">
                            <b>Restobar Delivery</b>
                        </div>
                    </div>
                    <div className="card-body login-card-body">
                        <p className="login-box-msg">
                            Inicia sesion para continuar
                        </p>
                        {loading && (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Cargando...</span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form onSubmit={submitHandler}>
                            <div className="input-group mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-end">
                                <div className="col-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                    >
                                        Ingresar
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-3 text-center">
                            <span>
                                No tienes cuenta?{" "}
                                <a href="/register">Registrate</a>
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default LoginScreen;
