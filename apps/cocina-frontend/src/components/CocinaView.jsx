import { useLocation, useParams } from 'react-router-dom';

export const CocinaView = () => {
  // Captura params si usas /cocina/mesa/1 o ?mesaId=1
  const { mesaId } = useParams(); 
  const query = new URLSearchParams(useLocation().search);
  const mesaFiltrada = mesaId || query.get('mesaId');

  return (
    <div>
      <h1>Pantalla de Cocina</h1>
      {mesaFiltrada && <p>Filtrando comandes de la Mesa: {mesaFiltrada}</p>}
      
      {/* Aquí renderizas la lista de comandes filtradas o globales */}
    </div>
  );
};