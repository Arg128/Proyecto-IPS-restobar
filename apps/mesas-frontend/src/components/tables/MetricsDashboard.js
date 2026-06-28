import React from 'react';

export default function MetricsDashboard({ totalMesas, ocupadas, disponibles }) {
  const porcentaje = totalMesas > 0 ? Math.round((ocupadas / totalMesas) * 100) : 0;

  return (
    <div className="row" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
      <div className="card" style={{ flex: 1, padding: '15px', background: '#17a2b8', color: '#fff', borderRadius: '8px' }}>
        <h5>Ocupación Total</h5>
        <h3>{porcentaje}%</h3>
      </div>
      <div className="card" style={{ flex: 1, padding: '15px', background: '#28a745', color: '#fff', borderRadius: '8px' }}>
        <h5>Mesas Disponibles</h5>
        <h3>{disponibles}</h3>
      </div>
      <div className="card" style={{ flex: 1, padding: '15px', background: '#dc3545', color: '#fff', borderRadius: '8px' }}>
        <h5>Mesas Ocupadas</h5>
        <h3>{ocupadas}</h3>
      </div>
    </div>
  );
}
