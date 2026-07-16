import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../api/axiosInstance";

const AuthContext = createContext(null);

// Credenciales fijas del "mozo" - usuario de prueba existente
const MOZO_EMAIL = "user@example.com";
const MOZO_PASSWORD = "123456";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const { data } = await api.post("/users/login", {
                    email: MOZO_EMAIL,
                    password: MOZO_PASSWORD,
                });
                setAuthToken(data.token);
                setUser(data);
            } catch (err) {
                console.error("Auto-login falló:", err);
                setError("No se pudo conectar. Reintentando...");
            } finally {
                setIsReady(true);
            }
        };
        autoLogin();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isReady, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);