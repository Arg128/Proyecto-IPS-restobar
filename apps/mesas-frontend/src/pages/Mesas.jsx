import React, { useState } from 'react';

export default function MesasRestaurante() {
  // 1. Estado inicial de las 6 mesas (false = Disponible, true = Ocupada)
  const [mesas, setMesas] = useState([
    { id: 1, ocupada: false },
    { id: 2, ocupada: true },
    { id: 3, ocupada: false },
    { id: 4, ocupada: false },
    { id: 5, ocupada: true },
    { id: 6, ocupada: false },
  ]);

  // 2. Función para alternar el estado de una mesa específica
  const cambiarEstadoMesa = (id) => {
    setMesas(mesas.map(mesa => 
      mesa.id === id ? { ...mesa, ocupada: !mesa.ocupada } : mesa
    ));
  };

  // 3. Cálculos en tiempo real para las métricas superiores
  const totalMesas = mesas.length;
  const ocupadas = mesas.filter(m => m.ocupada).length;
  const disponibles = totalMesas - ocupadas;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Encabezado Principal */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            🪑 Mesas de RESTOBAR
          </h1>
          <p className="text-slate-500 mt-1">
            Estructura visual de las mesas del establecimiento en tiempo real.
          </p>
        </header>

        {/* Módulo de Métricas (Dashboard) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-500">Ocupación Total</span>
            <div className="text-2xl font-bold mt-1 text-slate-900">
              {Math.round((ocupadas / totalMesas) * 100)}%
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-500">🟢 Mesas Disponibles</span>
            <div className="text-2xl font-bold mt-1 text-emerald-600">{disponibles}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-500">🔴 Mesas Ocupadas</span>
            <div className="text-2xl font-bold mt-1 text-rose-600">{ocupadas}</div>
          </div>
        </section>

        <hr className="border-slate-200 mb-8" />

        {/* Plano/Cuadrícula de Mesas */}
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mesas.map((mesa) => (
            <div 
              key={mesa.id}
              className={`bg-white p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm flex flex-col items-center justify-between h-52 ${
                mesa.ocupada ? 'border-rose-500 ring-4 ring-rose-50' : 'border-emerald-500 ring-4 ring-emerald-50'
              }`}
            >
              {/* Representación visual superior de la mesa */}
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {mesa.ocupada ? '🔴 🍽️' : '🟢 🪟'}
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Mesa {mesa.id}
                </h3>
                <p className={`text-sm font-semibold mt-1 ${
                  mesa.ocupada ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {mesa.ocupada ? 'OCUPADA' : 'DISPONIBLE'}
                </p>
              </div>

              {/* Botón de acción al fondo de la tarjeta */}
              <button
                onClick={() => cambiarEstadoMesa(mesa.id)}
                className={`w-full py-2 px-4 rounded-xl font-medium transition-colors duration-150 text-sm ${
                  mesa.ocupada 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {mesa.ocupada ? 'Liberar' : 'Asignar'}
              </button>
            </div>
          ))}
        </main>

      </div>
    </div>
  );
}
