import React from 'react';

export default function TableCard({ mesa, onCambiarEstado }) {
  const borderColor = mesa.ocupada ? '#fff' : '#28a745';
  const backgroundColorDiv = mesa.ocupada ? '#C72F7D' : '#fff'; 
  return (
    <button
      onClick={() => onCambiarEstado(mesa.id)}
      className="btn col-md-4"
      style={{
        width: '100%',
        padding: '10px',
        backgroundColor: mesa.ocupada ? '#6c757d' : '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
    <div className="" style={{ marginBottom: '20px' }}>
      <div className="card" style={{ borderTop: `4px solid ${borderColor}`, padding: '20px', textAlign: 'center', background: `${backgroundColorDiv}`, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
          {mesa.ocupada ? '🍽️' : '🪟'}
        </div>
        <h4>Mesa {mesa.id}</h4>
        <p style={{ color: borderColor, fontWeight: 'bold' }}>
          {mesa.ocupada ? 'OCUPADA' : 'DISPONIBLE'}
        </p>
      </div>
    </div>
    {mesa.ocupada ? 'Liberar Mesa' : 'Asignar Mesa'}
    </button>
  );
}
