import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerClient } from "../actions/clientActions";

const RegisterScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [dni, setDni] = useState("");

    const dispatch = useDispatch();

    const clientRegister = useSelector((state) => state.clientRegister);
    const { clientInfo, error, loading } = clientRegister;

    useEffect(() => {
        if (clientInfo) {
            history.push("/delivery");
        }
    }, [history, clientInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(registerClient({ name, email, password, address, phone, dni }));
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
                            Registrate para continuar
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
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user" />
                                    </div>
                                </div>
                            </div>
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
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Direccion"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-map-marker-alt" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Telefono"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-phone" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="DNI"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-id-card" />
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-end">
                                <div className="col-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-3 text-center">
                            <span>
                                Ya tienes cuenta?{" "}
                                <a href="/login">Inicia sesion</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
