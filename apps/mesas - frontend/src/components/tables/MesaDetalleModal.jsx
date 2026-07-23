import React from 'react';
import { useNavigate } from 'react-router-dom';
import { enviarPedidoACocina } from '../services/pedidosService';

export const MesaDetalleModal = ({ mesa, onClose }) => {
  const navigate = useNavigate();

  // Opción A: Enviar comanda/pedido a cocina a través de la API
  const handleEnviarPedido = async () => {
    const nuevoPedido = [
      { producto_id: 1, cantidad: 2, nota: "Sin cebolla" }
    ];
    
    await enviarPedidoACocina(mesa.id, nuevoPedido);
    alert(`Pedido de la Mesa ${mesa.numero} enviado a cocina`);
    onClose();
  };

  // Opción B: Navegar/Ver directamente la vista de Cocina filtrada por esa mesa
  const handleIrACocina = () => {
    // Si están dentro de la misma app/mismo router:
    navigate(`/cocina?mesaId=${mesa.id}`);
    
    // Si son apps desplegadas en puertos/dominios distintos:
    // window.location.href = `http://localhost:3001/cocina?mesaId=${mesa.id}`;
  };

  return (
    <div className="modal">
      <h3>Mesa #{mesa.numero}</h3>
      <button onClick={handleEnviarPedido}>
        🍳 Enviar Pedido a Cocina
      </button>
      <button onClick={handleIrACocina}>
        👀 Ver Estado en Cocina
      </button>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};