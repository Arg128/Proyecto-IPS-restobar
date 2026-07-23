import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Ajusta la URL de tu backend PHP/Laravel

export const enviarPedidoACocina = async (mesaId, productos) => {
  try {
    const response = await axios.post(`${API_URL}/pedidos`, {
      mesa_id: mesaId,
      items: productos,
      estado: 'PENDIENTE_COCINA' // Estado que leerá cocina-frontend
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el pedido a cocina:", error);
    throw error;
  }
};