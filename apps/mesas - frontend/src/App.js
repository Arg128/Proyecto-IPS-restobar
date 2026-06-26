import TablesPage from './pages/TablesPage';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import CocinaScreen from "./screens/CocinaScreen";
import ConfigScreen from "./screens/ConfigScreen";
import MenuStockScreen from "./screens/MenuStockScreen";
import PrivateRoute from "./auth/PrivateRoute";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [mesas, setMesas] = useState([]);
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || `${process.env.HOST || "http://localhost"}:${process.env.RESTO_BACKEND_PORT || 5000}`;
  // Ejemplo de enlace con tu API del backend de Restobar
  useEffect(() => {
    axios.post('/api/mesas')
      .then(response => setMesas(response.data))
      .catch(error => console.error("Error cargando mesas:", error));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Panel de Control - Módulo Mesas</h1>
      <p>Gestión y disponibilidad de mesas en tiempo real.</p>
      {/* Aquí mapeas o estructuras tus componentes de mesas igual que cocina */}
    </div>
  );
}

export default App;
