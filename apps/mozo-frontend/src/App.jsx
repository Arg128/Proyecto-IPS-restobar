import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MesasPage from "./pages/MesasPage";
import TomarPedidoPage from "./pages/TomarPedidoPage";

const AppContent = () => {
    const { isReady, error } = useAuth();

    if (!isReady) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Routes>
            <Route path="/" element={<MesasPage />} />
            <Route path="/pedido/:tableId" element={<TomarPedidoPage />} />
        </Routes>
    );
};

const App = () => (
    <AuthProvider>
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    </AuthProvider>
);

export default App;