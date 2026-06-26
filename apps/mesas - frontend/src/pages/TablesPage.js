import React, { useState } from 'react';
import MetricsDashboard from '../components/tables/MetricsDashboard';
import TableCard from '../components/tables/TableCard';

export default function TablesPage() {
  const [mesas, setMesas] = useState([
    { id: 1, ocupada: false },
    { id: 2, ocupada: true },
    { id: 3, ocupada: false },
    { id: 4, ocupada: false },
    { id: 5, ocupada: true },
    { id: 6, ocupada: false },
  ]);

  const cambiarEstadoMesa = (id) => {
    setMesas(mesas.map(m => m.id === id ? { ...m, ocupada: !m.ocupada } : m));
  };

  const totalMesas = mesas.length;
  const ocupadas = mesas.filter(m => m.ocupada).length;
  const disponibles = totalMesas - ocupadas;

  return (
    <div style={{ padding: '20px', background: '#f4f6f9', minHeight: '100vh' }}>
      <div className="container-fluid">
        <h1 style={{ marginBottom: '5px' }}>🪑 Panel de Mesas</h1>
        <p className="text-muted" style={{ marginBottom: '25px' }}>Monitoreo del salón en tiempo real.</p>
        
        <MetricsDashboard 
          totalMesas={totalMesas} 
          ocupadas={ocupadas} 
          disponibles={disponibles} 
        />
        
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
          {mesas.map(mesa => (
            <TableCard 
              key={mesa.id} 
              mesa={mesa} 
              onCambiarEstado={cambiarEstadoMesa} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
